import { Handler } from "express";
import { createTransport } from "nodemailer"
import { ImapFlow } from "imapflow";

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
        if (err) { res.sendStatus(400); return };
        res.sendStatus(200).send(info.response);
    });
};

export const GET: Handler = async (req, res) => {
    if (!req.auth) return;

    const { inbox, limit } = req.body;
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

        const lock = await client.getMailboxLock(inbox);
        
    } catch(err) {

    }
}