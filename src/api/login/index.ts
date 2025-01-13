import { Handler } from "express";
import { ImapFlow } from "imapflow";
import jwt from 'jsonwebtoken'

const secret = process.env.SECRET as string;

export const POST: Handler = async (req, res) => {
    const { email, password } = req.body;

    const client = new ImapFlow({
        host: 'imap.gmail.com',
        port: 993,
        secure: true,
        
        auth: {
            user: email,
            pass: password
        }
    });

    try {
        await client.connect();
        await client.logout();
    } catch (err) {
        res.sendStatus(400); return;
    };

    const token = jwt.sign({
        email, password
    }, secret, {
        expiresIn: '7d',
        algorithm: 'HS256'
    });

    res.status(200).send({ token });
}