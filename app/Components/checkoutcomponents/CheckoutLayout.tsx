/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { useOpenCheckoutContext, useThemeContext } from '../assets/contexts'
import { XCircleFill } from 'react-bootstrap-icons'
import PlansTypes from './PlansTypes'
import Subscriptions from './Subscriptions'
import { supabase } from '../assets/supabase-client'
import { useEffect, useState } from 'react'
import { ProfileType } from '../assets/assets'
import { Session } from '@supabase/supabase-js'
export default function CheckoutLayout() {
    const { mode } = useThemeContext()
    const { setOpenCheckout, openCheckout } = useOpenCheckoutContext()
    const [authUser, setAuthUser] = useState<ProfileType | null>(null)
    const [selectedPlan, setSelectedPlan] = useState<string>("")
    const [selectedOffer, setSelectedOffer] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [session, setSession] = useState<Session | null>(null)

    const getSession = async () => {
        const { data: session, error } = await supabase.auth.getSession()
        if (error || !session) {
            console.log("error in getting session ", error?.message)
            return
        }
        if (session) {
            setSession(session?.session)
        }

    }

    useEffect(() => {
        getSession()
    }, [])

    const getUser = async () => {
        const { data: authData, error:authError  } = await supabase.auth.getUser() 
        if (authError || !authData?.user || !session) {
            return
        }
        if (authData?.user) {
            const { data } = await supabase.from("users").select("*").eq("id", authData.user.id).single()
            if (data) {
                setAuthUser(data)
                setSelectedPlan(data.currentPlan || "")
                setSelectedOffer(data.current_offer || "")
            }
        }
    }

    const handleUpgradePlan = async () => {
        if (!authUser?.id) return

        setLoading(true)
        const { data: updateData, error } = await supabase
            .from("users")
            .update({
                currentPlan: selectedPlan,
                current_offer: selectedOffer
            })
            .eq("id", authUser.id)
            .select()

        setLoading(false)

        if (error) {
            console.log("error in updating plan/offer", error.message)
        } else {
            console.log("Updated successfully!", updateData)
            // تحديث الـ State المحلية فوراً عشان الـ UI يسمع صح من غير ما تحتاج Refresh
            setAuthUser(prev => prev ? { 
                ...prev, 
                currentPlan: selectedPlan,
                current_offer: selectedOffer 
            } : null)
            
            // قفل نافذة الـ Checkout بعد النجاح
            setOpenCheckout(false)
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    return (
        <article 
            className={`fixed top-0 z-50 w-full md:w-[800px] h-screen overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-3 pt-9 md:pt-20 border-l-2 border-blue-600 ${
                openCheckout ? "right-0" : "-right-[200%]"
            } ${
                mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"
            }`}
        >            
            <XCircleFill 
                onClick={() => setOpenCheckout(false)} 
                className='absolute top-2.5 left-2.5 text-3xl hover:text-red-600 cursor-pointer' 
            />
            
            {/* مكون الباقات */}
            <PlansTypes 
                selectedPlan={selectedPlan} 
                setSelectedPlan={setSelectedPlan} 
            />
            
            {/* مكون العروض والاشتراكات */}
            <Subscriptions 
                selectedOffer={selectedOffer} 
                setSelectedOffer={setSelectedOffer} 
            />
            
            {/* زرار الدفع / الترقية النهائي */}
            <button 
                className='w-full p-3 mt-4 rounded-2xl bg-blue-600 hover:bg-blue-800 text-white font-bold transition-all duration-200 disabled:opacity-50 cursor-pointer' 
                onClick={handleUpgradePlan}
                disabled={loading}
            > 
                {loading ? "Upgrading..." : "Upgrade Plan"}  
            </button>
        </article>
    )
}