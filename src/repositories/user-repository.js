import { prisma } from '../lib/prisma.js';

async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

async function findUserById(id) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

const userRepository = {
  findUserByEmail,
  findUserById,
};

export default userRepository;