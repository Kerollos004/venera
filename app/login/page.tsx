import React from 'react'
import type { Metadata } from "next";
import RegisterLayout from '../Components/registercomponents/RegisterLayout';
export const metadata: Metadata = {
    title: "login",
    description: "venera saas app login page",
};
export default function Login() {
    return (
        <main className='w-full min-h-screen bg-fixed flex items-center justify-center px-3.5 md:px-10 md:pt-20 py-10'>
            <RegisterLayout/>
        </main>
    )
}
