import { getSession } from 'next-auth/client';
import prisma from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword, verifyPassword } from '../../../lib/auth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PATCH') {
        return;
    }

    const session = await getSession({ req: req });

    if (!session) {
        res.status(401).json({ message: 'Not authenticated!', error: true });
        return;
    }

    const userEmail = session.user.email;
    const newName = req.body.newName;
    console.log(newName);
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const user = await prisma.user.findUnique({
        where: {
            email: userEmail,
        },
        select: {
            email: true, password: true,
        }
    }
    );

    if (!user) {
        res.status(404).json({ message: 'User not found.', error: true });
        return;
    }

    const currentPassword = user.password;

    const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);

    if (!passwordsAreEqual) {
        res.status(403).json({ message: 'Invalid password.', error: true });
        return;
    }

    const hashedPassword = await hashPassword(newPassword);

    if (newName === "") {
        const result = await prisma.user.update({
            where: { email: userEmail },
            data: { password: hashedPassword }
        });
    } else {
        const result = await prisma.user.update({
            where: { email: userEmail },
            data: { name: newName, password: hashedPassword }
        });
    }

    res.status(200).json({ message: 'Password updated!', error: false });
}

export default handler;
