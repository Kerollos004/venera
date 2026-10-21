"use client"
import React, { useState, useEffect } from 'react'
import AdminStats from '../Components/admincomponents/AdminStats'
import AdminClients from '../Components/admincomponents/AdminClients'
import AdminProgress from '../Components/admincomponents/AdminProgress'
import { supabase } from '../Components/assets/supabase-client'
import { useRouter } from 'next/navigation'

export default function Admin() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [stats, setStats] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const verifyAdminAndFetch = async () => {
            const { data: { user }, error: authError } = await supabase.auth.getUser()

            if (authError || !user) {
                router.push('/login')
                return
            }

            const { data: currentAdmin, error: adminError } = await supabase
                .from("users")
                .select("is_admin")
                .eq("id", user.id)
                .single()

            if (adminError || !currentAdmin?.is_admin) {
                router.push('/')
                return
            }

            const { data, error } = await supabase.from("users").select("*")
            if (error) {
                console.log("Error fetching all clients:", error.message)
            } else {
                setStats(data || [])
            }

            setLoading(false)
        }

        verifyAdminAndFetch()
    }, [router])

    if (loading) {
        return (
            <main className='w-full min-h-screen flex items-center justify-center'>
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </main>
        )
    }

    return (
        <main className='w-full min-h-screen bg-fixed overflow-x-hidden py-20 px-3.5 md:px-10'>
            <AdminStats stats={stats} />
            <section className='grid grid-cols-1 items-start md:grid-cols-2 gap-2.5'>
                <AdminClients profiles={stats} />
                <AdminProgress profiles={stats} />
            </section>
        </main>
    )
}