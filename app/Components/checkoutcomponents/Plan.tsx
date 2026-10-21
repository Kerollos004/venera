// /* eslint-disable react-hooks/set-state-in-effect */
// "use client"
// import React, { useEffect, useState } from 'react'
// import { paymentPlan, ProfileType } from '../assets/assets'
// import { useThemeContext } from '../assets/contexts'
// import { supabase } from '../assets/supabase-client'

// export default function Plan({ plan }: { plan: paymentPlan }) {
//     const { mode } = useThemeContext()
//     const [authUser, setAuthUser] = useState<ProfileType | null>(null)

//     const getUserPlan = async () => {
//         const { data: authData, error: authError } = await supabase.auth.getUser()
        
//         if (authError || !authData?.user) {
//             console.log("error in getting auth user", authError?.message)
//             return
//         }
//         if (authData.user) {
//             const { data: profileData, error: profileError } = await supabase
//                 .from("users")
//                 .select("*")
//                 .eq("id", authData.user.id)
//                 .single()

//             if (profileError) {
//                 console.log("error in getting user profile", profileError.message)
//             }
//             if (profileData) {
//                 setAuthUser(profileData)
//             }
                    
//         }
//     }

//     useEffect(() => {
//         getUserPlan()
//     }, [])

//     const handleSelectPlan = async () => {
//         if (!authUser?.id) return
//         setAuthUser(prev => prev ? { ...prev, currentPlan: plan.name } : null)
//     }

//     const isSelected = authUser?.currentPlan === plan.name



//     return (
//         <div
//             onClick={handleSelectPlan}
//             className={`flex items-center   justify-between cursor-pointer p-4 rounded-3xl ${
//                 mode === "light" ? "bg-white text-black" : "bg-gray-900 text-white"
//             } `}
//         >
//             <div>
//                 <h3 className='text-3xl text-blue-600 font-bold'> {plan.name} </h3>
//             </div>

//             <div className="flex items-center gap-2">
//                 <input
//                     className='w-5 h-5 accent-blue-600 cursor-pointer'
//                     type="radio"
//                     name="checkout_plans_group"
//                     checked={isSelected}
//                     onChange={handleSelectPlan}
//                 />
//             </div>
//         </div>
//     )
// }

"use client"
import React from 'react'
import { paymentPlan } from '../assets/assets'
import { useThemeContext } from '../assets/contexts'

export default function Plan({ 
    plan, 
    selectedPlan, 
    onSelect 
}: { 
    plan: paymentPlan; 
    selectedPlan: string; 
    onSelect: (planName: string) => void; 
}) {
    const { mode } = useThemeContext()
    const isSelected = selectedPlan === plan.name

    return (
        <div 
            onClick={() => onSelect(plan.name)}
            className={`flex items-center justify-between cursor-pointer p-4 rounded-3xl border-2 transition-all duration-200 ${
                mode === "light" ? "bg-white text-black border-gray-200" : "bg-gray-900 text-white border-gray-800"
            } ${
                isSelected ? "border-blue-600 shadow-md ring-2 ring-blue-600/20" : "border-transparent"
            }`}
        >
            <div>
                <h3 className='text-3xl text-blue-600 font-bold'> {plan.name} </h3>
            </div>

            <div className="flex items-center gap-2">
                <input 
                    className='w-5 h-5 accent-blue-600 pointer-events-none'
                    type="radio"
                    name="checkout_plans_group"
                    checked={isSelected} 
                    readOnly
                />
            </div>
        </div>
    )
}