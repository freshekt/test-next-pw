'use client'
import {TextField, Button} from "@mui/material";
import  '../globals.css';

import {login} from "@/app/login/actions";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
// @ts-expect-error

import { experimental_useFormState as useFormState } from 'react-dom';
import Link from "next/link";
const  initialState = {};
export default function SingnIn() {
    const { pending } = useFormStatus();
    const [state, formAction] = useFormState(login, initialState);
    console.log(state);
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">

            <div style={{alignItems:'center'}} className="relative  place-items-center before:absolute before:t-[0px] before:l-[0px] before:r-[0px] before:b-[0px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] ">
                <h1>Sign In</h1>
                <form action={formAction}>
                    <div>
                        <TextField id="email" label="Email" name="email" variant="outlined" />
                        <p aria-live="polite" className="form-error">
                            {state?.email}
                        </p>
                    </div>
                    <div>
                        <TextField id="password" label="Password" name="password" type="password" variant="outlined" />
                        <p aria-live="polite" className="form-error">
                            {state?.password}
                        </p>
                    </div>
                    <div className="place-items-center">
                        <Button variant="outlined" type="submit" aria-disabled={pending}>Sign In</Button>
                        <p aria-live="polite" className="form-error">
                            {state?.custom}
                        </p>
                        <br/>
                        <p >
                        <Link href={'/sign-up'}>Sign Up</Link>
                        </p>
                    </div>
                </form>


            </div>

        </main>

    );
}
