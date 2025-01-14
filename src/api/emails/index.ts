import { Handler } from "express";
import { createTransport } from "nodemailer"
import { ImapFlow, MailboxObject } from "imapflow";
import { ParsedMail, simpleParser } from "mailparser";
import { parse } from "dotenv";

function createArray(start: number, end: number) {
    return Array.from({ length: end - start + 1 },
        (_, index) => start + index);
}

const concat_RS = (stream: any): any => new Promise((res, rej) => {
    let buffers: any[] = [];
    stream.on("data", function (data: any) { buffers.push(data); });
    stream.on("end", function () { res(Buffer.concat(buffers)); });
});

export const POST: Handler = async (req, res) => {
    if (!req.auth) return;

    const { email, password } = req.auth;
    const { sender, recipient, content, subject, cc, bcc } = req.body;

    const transport = createTransport({
        service: 'gmail',
        auth: {
            user: email,
            pass: password
        }
    });

    transport.sendMail({
        to: recipient,
        from: sender,
        cc, bcc,
        subject,
        text: content
    }, (err, info) => {
        if (err) { res.sendStatus(400); console.warn(err); return };
        res.sendStatus(200).send(info.response);
    });
};

export const PATCH: Handler = async (req, res) => {
    if (!req.auth) return;

    const { mailbox, limit } = req.body;
    const { email, password } = req.auth;

    const client = new ImapFlow({
        host: 'imap.gmail.com',
        port: 993,
        secure: true,

        auth: {
            user: email,
            pass: password
        }
    })

    try {
        await client.connect();

        const lock = await client.getMailboxLock(mailbox);
        try {
            //@ts-ignore
            const emails = await client.fetchAll(createArray(client.mailbox.exists - limit, client.mailbox.exists), {})

            const data = emails.map(async (email) => {    
                let { meta, content } = await client.download(email.seq.toString());
                const contentString = (await concat_RS(content)).toString()
                const parsedMail: ParsedMail = await simpleParser(contentString)

                return {
                    subject: parsedMail.subject,
                    from: parsedMail.from?.text,
                    content: parsedMail.text,
                    html: parsedMail.html || parsedMail.textAsHtml,
                    uid: email.seq
                }
            });

            await Promise.all(data)

            let resolved: any[] = []
            await Promise.all(data.map(async (mail) => {
                const stuff = await mail;
                resolved.push(stuff)
            }))

            res.status(200).send({
                data: resolved
            })
        } finally {
            lock.release()
        }

        client.close()
    } catch (err) {

    }
}