/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import React, { useEffect, useState } from 'react'
import { PaymentOffer, ProfileType } from '../assets/assets'
import CheckoutOffer from './CheckoutOffer'
import "../../reacti18"
import { useTranslation } from 'react-i18next'
import { PaymentOffers  } from '../assets/assets'
import { supabase } from '../assets/supabase-client'

export default function Subscriptions({ 
    selectedOffer, 
    setSelectedOffer 
}: { 
    selectedOffer: string; 
    setSelectedOffer: (offerName: string) => void; 
}) {
    const { t } = useTranslation()
    
    const [authUser, setAuthUser] = useState<ProfileType | null>(null)
    
    const getUser = async () => {
        const { data:authData } = await supabase.auth.getUser()
        if (authData?.user) {
            const { data } = await supabase.from("users").select("*").eq("id",authData?.user?.id ).single()
            if (data) {
                setAuthUser(data)
            }
        }
    }

    useEffect(() => {
        getUser()
    }, [])
    
    

    const offersMap = PaymentOffers.map((offer: PaymentOffer) => {
        return (
            <CheckoutOffer 
                key={offer.id} 
                offer={offer} 
                selectedOffer={selectedOffer}
                onSelect={(offerName) => setSelectedOffer(offerName)}
            />
        )
    })



    return (
        <article className='my-3'>
            <h3 className='text-2xl text-blue-600 mb-2'> {t("checkout.titles.subs")}</h3>
            <article className='grid-cols-1 grid md:grid-cols-2 gap-2.5'>
                {  
                offersMap
                }
                
            </article>
        </article>
    )
}
