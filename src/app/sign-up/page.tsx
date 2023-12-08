'use client'
import {TextField, Button} from "@mui/material";
import  '../globals.css';

import {register} from "@/app/sign-up/actions";
import Link from "next/link";
import {useState} from "react";

export type SignUpErrors = {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;

}
export default function SingnUp() {
    const [errors, setErrors] = useState<SignUpErrors>({});

    async function signUp(from: FormData) {

         const err = await  register(from);
         if(err !== undefined) {
             setErrors(err);
         }

    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">

            <div style={{alignItems:'center'}} className="relative  place-items-center before:absolute before:t-[0px] before:l-[0px] before:r-[0px] before:b-[0px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] ">
                <h1>Sign Up</h1>
                <form action={signUp}>
                    <div>
                        <TextField id="outlined-basic" label="Name" name="username" variant="outlined" />
                        <p aria-live="polite" className="form-error">{errors?.username ?? ""}</p>
                    </div>
                    <div>
                        <TextField id="outlined-basic" label="Email" name="email" variant="outlined" />
                        <p aria-live="polite" className="form-error">{errors?.email ?? ""}</p>
                    </div>
                    <div>
                        <TextField id="outlined-basic" label="Password" name="password" type="password" variant="outlined" />
                        <p aria-live="polite" className="form-error">{errors?.password ?? ""}</p>
                    </div>
                    <div>
                        <TextField id="outlined-basic" label="Confirm Password" name="confirmPassword" type="password" variant="outlined" />
                        <p aria-live="polite" className="form-error">{errors?.confirmPassword ?? ""}</p>
                    </div>
                    <div className="place-items-center">
                        <Button variant="outlined" type="submit" >Sign Up</Button>
                        <p aria-live="polite" className="form-error">{errors?.general ?? ""}</p>
                    </div>
                </form>
                <br/>
                <p >
                <Link href={'/sing-in'}>Sing In</Link>
                </p>

            </div>

        </main>

    );
}
