"use client"
import React from 'react'
import { PaymentOffer } from '../assets/assets'
import { useThemeContext } from '../assets/contexts'

export default function CheckoutOffer({ 
    offer, 
    selectedOffer, 
    onSelect 
}: { 
    offer: PaymentOffer; 
    selectedOffer: string; 
    onSelect: (offerName: string) => void; 
}) {
    const { mode } = useThemeContext()
    const isSelected = selectedOffer === offer.name

    return (
        <div 
            onClick={() => onSelect(offer.name)}
            className={`flex items-center justify-between cursor-pointer p-4 rounded-3xl border-2 transition-all duration-200 ${
                mode === "light" ? "bg-white text-black border-gray-200" : "bg-gray-900 text-white border-gray-800"
            } ${
                isSelected ? "border-blue-600 shadow-md ring-2 ring-blue-600/20" : "border-transparent"
            }`}
        >
            <div>
                <h3 className='text-2xl mb-2 font-bold text-blue-600'> {offer.name}  </h3>
                <p className='text-[18px] mb-2'> premium :  {offer.premValue} egp </p>
                <p className='text-[18px] mb-2'> pro :  {offer.proValue} egp </p>
            </div>
            
            <input
                className='w-5 h-5 accent-blue-600 pointer-events-none'
                type="radio"
                name="checkout_offers_group" 
                checked={isSelected} 
                readOnly
            />
        </div>
    )
}