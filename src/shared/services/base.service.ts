import {Prisma} from ".prisma/client";
import {PrismaClient} from "@prisma/client";

/**
 *  useDBClient - use db client
 */
export async function useDBClient<T>(action: (prisma: PrismaClient) => Promise<T>): Promise<T>{
    const prisma = new PrismaClient();
    return action(prisma)
        .finally(()=> prisma.$disconnect());
}
