
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

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.upsert({
        where: {
            email: adminEmail,
        },
        update: {
            password: hashedPassword,
            role: 'ADMIN',
        },
        create: {
            email: adminEmail,
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('Administrator seeded successfully.');
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
