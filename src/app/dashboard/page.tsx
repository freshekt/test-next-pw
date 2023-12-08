"use client"
import {Transaction, User} from "@prisma/client";
import {createTransaction, fetchTransactions, findAccounts, getMyAccount, logout} from "@/app/dashboard/actions";
import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";

import {experimental_useFormStatus as useFormStatus} from "react-dom";

import Autocomplete from '@mui/material/Autocomplete';
import {Logout} from "@mui/icons-material";

type FormError = {
    account?: string,
    amount?: string,
    general?: string
}
export default function Dashboard( /*props :InferGetServerSidePropsType< typeof  getServerSideProps>*/) {
    const {pending} = useFormStatus();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<User[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<User | null>(null);
    const [errors, setErrors] = useState<FormError>({});
    const [user, setMyAccount] = useState<User | null>(null);
    const [isTransactionLoading, setTransactionLoading] = useState(false);
    /**
     * load page data
     */
    const loadData = () => {
        setTransactionLoading(true);

        getMyAccount().then(
            (acc)=> setMyAccount(acc));

        fetchTransactions().then(data => {
            console.log({data});
            data.sort((a:Transaction ,b:Transaction) => b.date - a.date);
            setTransactions(data);
        }).catch((e) => {
            console.log(e);
        }).finally(() => {
            setTransactionLoading(false);
            console.log('end');
        });

    };

    useEffect(loadData, []);

    /**
     * search accounts
     * @param event
     */
    async function search(event: ChangeEvent<HTMLInputElement>) {
        var list = await findAccounts(event.currentTarget.value);
        setAccounts(list);
    }

    /**
     * onSubmit: create transaction
     * @param form
     */
    async function onSubmit(form: FormData) {
        try {

            if (selectedAccount == null) {
                throw new Error("USER_REQUIRED");
            }

            if (form.get('amount') == null) {
                throw new Error("AMOUNT_REQUIRED");
            }

            await createTransaction(selectedAccount, parseFloat(form.get('amount')!.toString()));
            (document.getElementById('transaction-from') as HTMLFormElement).reset();
            setSelectedAccount(null);
            loadData();

        } catch (ex: any) {
            console.log(ex);
            switch (ex.message) {
                case "USER_REQUIRED":
                    setErrors({['account']: "Please select the account"});
                    break;

                case "AMOUNT_REQUIRED":
                    setErrors({['amount']: "Please enter amount "});
                    break;

                case "USER_TO_NOT_FOUND":
                    setErrors({['account']: "The account not found "});
                    break;

                case "USER_NO_MONEY":
                    setErrors({['amount']: "Not enough money for transaction "});
                    break;

                default:
                    setErrors({['general']: "Unknown error"});
                    break;
            }
        }
    }


    return (<main>
        <header>
            <h1>Dashboard</h1>
            <div>{user?.username || "Loading..."}{user !== null ? `, ${user.balance } PW`: ""}
            </div>
            <form action={logout}><Button variant="outlined" endIcon={<Logout />} type="submit">
                Logout
            </Button></form>
        </header>
        <div className="transactions">
            <div className="transactions-list">
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell >From</TableCell>
                                <TableCell >To</TableCell>
                                <TableCell >Amount</TableCell>
                                <TableCell >Balance</TableCell>
                                <TableCell >Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { isTransactionLoading? (<TableRow>
                                <TableCell colSpan={6} align="center">Loading</TableCell>
                            </TableRow>) : transactions.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell component="th" scope="row">
                                        {item.name}
                                    </TableCell>
                                    <TableCell>
                                        {item.fromUser.username }
                                    </TableCell>
                                    <TableCell>
                                        {item.toUser.username }
                                    </TableCell>
                                    <TableCell>
                                        <span className={user?.id === item.fromUserId ? 'credit':'debit'}> {user?.id === item.fromUserId ? '-':'+'}{item.amount.toString()} PW </span>
                                    </TableCell>
                                    <TableCell>
                                        {user?.id === item.fromUserId ? item.fromBalance.toString():item.toBalance.toString()} PW
                                    </TableCell>
                                    <TableCell>
                                        {item.date.toLocaleString()}
                                    </TableCell>
                                </TableRow>))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </div>
            <div className="transactions-form">
                <form id="transaction-from" action={onSubmit}>
                    <div>
                        <Autocomplete
                            value={selectedAccount}
                            onChange={(event: any, newValue: User | null) => {
                                setSelectedAccount(newValue);
                            }}
                            getOptionLabel={(o) => o.username}
                            renderInput={
                                (params) =>
                                    <TextField {...params} label="Account" onChange={search}/>
                            }
                            options={accounts}></Autocomplete>


                        <p aria-live="polite" className="form-error">
                            {errors?.account ?? ""}
                        </p>
                    </div>
                    <div>
                        <TextField id="amount" label="Amount" name="amount" variant="outlined"/>
                        <p aria-live="polite" className="form-error">
                            {errors?.amount ?? ""}
                        </p>
                    </div>
                    <div className="place-items-center">
                        <Button variant="outlined" type="submit" aria-disabled={pending}>Send</Button>
                        <p aria-live="polite" className="form-error">
                            {errors?.general ?? ""}
                        </p>
                    </div>
                </form>
            </div>
        </div>

    </main>);
}
