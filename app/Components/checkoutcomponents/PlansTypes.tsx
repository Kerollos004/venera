

"use client"
import React from 'react'
import Plan from './Plan'
import { paymentPlans } from '../assets/assets'
import "../../reacti18"
import { useTranslation } from 'react-i18next'

export default function PlansTypes({ 
    selectedPlan, 
    setSelectedPlan 
}: { 
    selectedPlan: string; 
    setSelectedPlan: (planName: string) => void; 
}) {
    const { t } = useTranslation()

    const plansMap = paymentPlans.map((plan) => {
        return (
            <Plan 
                key={plan.id} 
                plan={plan} 
                selectedPlan={selectedPlan}
                onSelect={(planName) => setSelectedPlan(planName)}
            />
        )
    })

    return (
        <article className='my-3 mt-6'>
            <h3 className='text-2xl text-blue-600 mb-2'> {t("checkout.titles.plans")} </h3>
            <article className='grid grid-cols-1 md:grid-cols-3 gap-2.5'>
                {plansMap}
            </article>
        </article>
    )
}