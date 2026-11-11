/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import React, { useEffect, useState } from 'react'
import LoginForm from './LoginForm'
import SignUpForm from './SignupForm'
import { useFormContext } from '../assets/contexts'
import { supabase } from '../assets/supabase-client'
import { useRouter } from 'next/navigation'

export default function RegisterLayout() {
    const [authed, setAuthed] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const { form, setForm } = useFormContext() // بنستدعي الـ form عشان نعرف هو واقف فين
    const router = useRouter()

    const checkAuth = async () => {
        setLoading(true)
        const { error, data: { session } } = await supabase.auth.getSession()
        
        if (error || !session) {
            setAuthed(false)
            setLoading(false)
            setForm("create")
            return
        }

        setAuthed(true)
        setLoading(false)
        setForm("login")
    }

    useEffect(() => { 
        checkAuth()
    }, [])

    if (loading) {
        return <div className="text-center py-20 text-blue-500 text-xl">Loading...</div>; // أو Skeleton خفيف
    }

    return (
        <>
            {/* بناءً على الـ form context (login أو signup) بنعرض الفورم المناسب لو مش مسجل */}
            {form === "login" ? <LoginForm /> : <SignUpForm />}
        </>
    )
}