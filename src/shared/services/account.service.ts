'use server'
import {PrismaClient, User} from '@prisma/client'
import {useDBClient} from "@/shared/services/base.service";


const cryptPassword = function (password: string, callback: (err: any, hash?: string) => any) {
    const bcrypt = require('bcryptjs');
    bcrypt.genSalt(10, function (err: any, salt: any) {
        if (err)
            return callback(err);

        bcrypt.hash(password, salt, function (err: any, hash: string) {
            return callback(err, hash);
        });
    });
};


/**
 * create user in database
 * @param user
 * @return User
 */
export async function create(user: Partial<User>): Promise<User> {
    return new Promise((resolve, reject) => {
        const prisma = new PrismaClient();

        cryptPassword(user.password!.toString(), async (err: any, password) => {
            try {
                if (err) {
                    reject(err);
                    return err;
                }
                if (password != undefined) {
                    const newUser = await prisma.user.create({
                        data: {
                            username: user.username!,
                            email: user.email!,
                            balance: user.balance!,
                            password: password,
                        }
                    });

                    await prisma.$disconnect()
                    resolve(newUser);
                } else {
                    await prisma.$disconnect()
                    reject(new Error("password_not_set"));
                }
            } catch (e) {
                await prisma.$disconnect()
                reject(e);
            }
        });
    });

}

/**
 * returns user by email
 * @param email
 * @return User or null
 */
export async function getByEmail(email: string): Promise<User | null> {

    const prisma = new PrismaClient();
    return prisma.user.findFirst({where: {email}}).then(u => {
        prisma.$disconnect();
        return u;
    }).catch(() => {
        prisma.$disconnect();
        return null;
    });

}


/**
 * find user accounts in database
 * @param term
 * @return User[]
 */
export async function findUserAccounts(term: string): Promise<User[]> {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useDBClient<User[]>((prisma) => prisma.user.findMany({
        where: {

            OR: [{
                username: {
                    contains: term
                }
            },{
                email: {
                    contains: term
                }
            }]
        }
    }));


}

/**
 * find user account by id in database
 * @param term
 * @return User[]
 */
export async function findUserAccountById(id: number): Promise<User | null> {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useDBClient<User | null>((prisma) => prisma.user.findFirst({where: {id}}));


}

