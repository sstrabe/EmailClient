import type { Handler } from 'express';

export const GET: Handler = (req, res) => {
    res.json({ message: 'Hello world' })
}