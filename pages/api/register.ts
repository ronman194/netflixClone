import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'POST') {
            return res.status(405).end();
        }
        const { email, name, password } = req.body;
        const existingUser = await prismadb.user.findUnique({
            where: {
                email,
            }
        });
        if (existingUser) {
            return res.status(422).json({ error: 'Email Taken Already' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await prismadb.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                image: '',
                emailVerified: new Date(),
            }
        });
        return res.status(200).json(user);
    } catch (err) {
        console.log(err);
        return res.status(400).end();
    }
}