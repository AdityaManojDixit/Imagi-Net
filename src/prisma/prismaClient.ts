// import { PrismaClient } from '@prisma/client';

// // Define a global variable to store the PrismaClient instance
// let prisma: PrismaClient;

// if (process.env.NODE_ENV === 'production') {
//   // In production, create a new PrismaClient instance
//   prisma = new PrismaClient();
// } else {
//   // In development, use a global variable to cache the PrismaClient instance
//   if (!(global as any).prisma) {
//     (global as any).prisma = new PrismaClient();
//   }
//   prisma = (global as any).prisma;
// }

// export default prisma;
