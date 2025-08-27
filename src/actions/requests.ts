import { User } from '@prisma/client';
import { prisma } from '@/lib/db/postgres';


export async function getAllUsers() {
  console.log("working");
}

// export async function getAllUsers(): Promise<User[]> {
export async function getUsers(): Promise<User[]> {
  try {
    const users = await prisma.user.findMany();
    console.log(users);
    return(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
}


export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}
