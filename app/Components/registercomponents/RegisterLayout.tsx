"use client"
import React from 'react'
import LoginForm from './LoginForm'
import SignUpForm from './SignupForm'
import { useFormContext } from '../assets/contexts'
export default function RegisterLayout() {
    const {form} = useFormContext()
    return (
        <>
            {
                form==="login" ? <LoginForm/> : <SignUpForm/>
            }
        </>
    )
}
