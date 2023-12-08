'use server'

import {cookies} from "next/headers";
import {TokenDto} from "@/shared/models/token.dto";
import {createUserTransaction, getTransactions} from "@/shared/services/transaction.service";
import {Transaction, User} from "@prisma/client";
import {redirect} from "next/navigation";
import {findUserAccountById, findUserAccounts} from "@/shared/services/account.service";

/**
 * fetchTransactions - fetch all transactions where current user was involved
 * @return  Promise<Transaction[]> - list of transactions
 */
export async function fetchTransactions(): Promise<Transaction[]> {
    const tokenCookie = cookies().get('tokenData');
    if (tokenCookie !== undefined) {
        const tokenData = JSON.parse(tokenCookie.value) as TokenDto;
        return  await getTransactions(tokenData.userId);
    }
    return [];
}

/**
 * createTransaction - create transaction
 * @param User - account to send currency
 * @param amount - amount of currency to send
 * @return  Transaction
 */
export async function createTransaction(account: User, amount: number): Promise<Transaction> {
    const tokenCookie = cookies().get('tokenData');
    if (tokenCookie === undefined) {
        redirect('/login');
    }
    const tokenData = JSON.parse(tokenCookie.value) as TokenDto;

    return createUserTransaction(tokenData.userId, account.id, amount);
}

/**
 * find accounts by username
 * @param term
 */
export async function findAccounts(term: string): Promise<User[]> {
    const tokenCookie = cookies().get('tokenData');
    if (tokenCookie === undefined) {
        redirect('/login');
    }
    const tokenData = JSON.parse(tokenCookie.value) as TokenDto;

    return findUserAccounts(term).then(data => data.filter(a => a.id !== tokenData.userId));
}


/**
 * get my account
 */
export async function getMyAccount(): Promise<User> {
    const tokenCookie = cookies().get('tokenData');
    if (tokenCookie === undefined) {
        redirect('/login');
    }
    const tokenData = JSON.parse(tokenCookie.value) as TokenDto;

    var user = await findUserAccountById(tokenData.userId);

    if(user === null){
        redirect('/login');
    } else {
        return  user;
    }
}

export async function logout() {
    const tokenCookie = cookies().get('tokenData');
    if (tokenCookie !== undefined) {
        cookies().delete('tokenData');
    }

    redirect('/login');
}











