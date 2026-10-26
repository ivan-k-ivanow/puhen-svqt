
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { prisma } from '../server/src/lib/prisma.js';

async function main() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        throw new Error(
            'Admin email or password is not set in the environment variables.'
        );
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            email: adminEmail,
        },
    });

    if (existingUser) {
        console.log('Test administrator already exists. No changes made.');
        return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
        data: {
            email: adminEmail,
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('Test administrator created successfully.');
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
