'use server'
import {PrismaClient, Transaction, User} from '@prisma/client'
import {Prisma} from ".prisma/client";
import {useDBClient} from "@/shared/services/base.service";
import Decimal = Prisma.Decimal;

/**
 * getTransactions - fetch all transactions where current user was involved
 * @param userId -  Account ID
 * @return  Promise<Transaction[]> - list of transactions
 */

export async function getTransactions(userId: number): Promise<Transaction[]> {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return await useDBClient<Transaction[]>((prisma) => prisma.transaction.findMany({
        include:{
            fromUser: true,
            toUser: true
        },

        where: {
            OR: [{
                fromUserId: userId
            }, {
                toUserId: userId
            }]
        }
    }));
}


/**
 * createUserTransaction  - create transaction
 * @param fromUserId - user that send money
 * @param toUserId - user that receive money
 * @param amount - money amount
 * @return Transaction - created transaction
 */
export async function createUserTransaction(fromUserId: number, toUserId: number, amount: number): Promise<Transaction> {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useDBClient<Transaction>(async (prisma) => {
        const fromUser = await prisma.user.findFirst({
            where: {
                id: fromUserId
            }
        });
        const toUser = await prisma.user.findFirst({
            where: {
                id: toUserId
            }
        });

        if (!fromUser) {
            throw new Error("USER_FROM_NOT_FOUND");
        }

        if (!toUser) {
            throw new Error("USER_TO_NOT_FOUND");
        }

        if (fromUser.balance.lessThan(amount)) {
            throw new Error("USER_NO_MONEY");
        }

        fromUser.balance = fromUser?.balance.minus(amount);
        toUser.balance = toUser?.balance.plus(amount);
        return prisma.transaction.create({
            data: {
                fromUserId,
                toUserId,
                amount,
                fromBalance: fromUser.balance,
                toBalance: toUser.balance,
                name: `${fromUserId}-${toUserId}-${Date.now()}`,
                date: new Date()
            }
        }).then(async (r) => {
            await prisma.user.update({where: {id: fromUserId}, data: fromUser});
            await prisma.user.update({where: {id: toUserId}, data: toUser});
            return r;
        });
    });
}


