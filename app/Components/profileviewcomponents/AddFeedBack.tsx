/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Drawer, DrawerHeader, DrawerContent, DrawerTitle } from '@/components/ui/drawer'
import { StarFill } from 'react-bootstrap-icons'
import { useThemeContext } from '../assets/contexts'
import { feedBack } from '../assets/assets'
import { supabase } from '../assets/supabase-client'

export default function AddFeedBack({ opened, setOPened, id }: { opened: boolean, setOPened: Dispatch<SetStateAction<boolean>>, id: string }) { 
    const { mode } = useThemeContext()
    
    // بداءنا الـ state بأوبجكت افتراضي عشان نتجنب الـ null errors
    const [newFeedBack, setNewFeedBack] = useState<Partial<feedBack>>({
        feedback: '',
        feedback_rate: 0,
        feedback_doctor: id,
        feedback_owner: ''
    })
    
    const [clickedStars, setClickedStars] = useState<number>(0)
    
    const getuser = async () => {
        const { data: authUser, error: authError } = await supabase.auth.getUser()
        if (authError || !authUser?.user) {
            console.log("error in getting data", authError?.message)
            return
        }
        const userId = authUser.user.id
        if (userId) {
            setNewFeedBack(prev => ({ ...prev, feedback_owner: userId }))
        }
    }

    useEffect(() => {
        getuser()
    }, [])
    
    useEffect(() => {
        if (id) {
            setNewFeedBack(prev => ({ ...prev, feedback_doctor: id }))
        }
    }, [id])
    
    const handleAddFeedBack = async () => {
        const { error, data } = await supabase.from("feedbacks").insert([newFeedBack])
        if (error) {
            console.log("error in adding feedbacks", error?.message)
        } else {
            console.log("Feedback added successfully", data)
            // تفريغ الفورم وقفل الدرج بعد الإرسال الناجح
            setNewFeedBack({ feedback: '', feedback_rate: 0, feedback_doctor: id, feedback_owner: newFeedBack.feedback_owner })
            setClickedStars(0)
            setOPened(false)
        }
    }
    
    const starsRate = () => {
        return Array.from({ length: 5 }).map((_, i) => {
            const starNumber = i + 1; 
            const isSelected = clickedStars >= starNumber;

            return (
                <StarFill 
                    key={i}
                    onClick={() => {
                        setClickedStars(starNumber)
                        // استخدام starNumber مباشرة يضمن أن القيمة الحقيقية بتتسجل فوراً مش القديمة
                        setNewFeedBack(prev => ({ ...prev, feedback_rate: starNumber }))
                    }} 
                    size={24} 
                    className={`inline-block mx-1 cursor-pointer transition-colors ${
                        isSelected ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                    }`} 
                />
            )
        })
    }

    return (
        <Drawer
            open={opened}
            onOpenChange={(open) => setOPened(open)}
        >
            <DrawerContent className={`overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] flex [&::-webkit-scrollbar]:hidden h-[50vh] ${mode === "light" ? "bg-gray-300 text-black" : "bg-gray-800 text-white"}`}>
                <div className="flex justify-center my-2.5">
                    <div className="w-2/5 h-2 rounded-lg bg-blue-300"></div>
                </div>
                
                <DrawerHeader>
                    <DrawerTitle className="mb-2.5 capitalize text-center text-3xl text-blue-600">
                        add feedback
                    </DrawerTitle>
                </DrawerHeader>

                <div className="p-4 mb-3 flex flex-col items-center gap-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <textarea 
                        name="" 
                        id="" 
                        value={newFeedBack?.feedback || ''}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            e.preventDefault()
                            const val = e.target.value
                            setNewFeedBack(prev => ({ ...prev, feedback: val }))
                        }}
                        placeholder="Type your feedback here..." 
                        className='w-full md:w-[700px] text-xl p-3 border border-gray-200 focus:border-blue-600 rounded-3xl bg-transparent' 
                    ></textarea>
                    
                    {/* النجوم */}
                    <div className="flex items-center">
                        {starsRate()}
                    </div>

                    <button 
                        onClick={async (e) => {
                            e.preventDefault()
                            await handleAddFeedBack()
                        }} 
                        className='w-full md:w-[700px] text-2xl p-3 bg-blue-600 text-white rounded-3xl hover:bg-blue-800 transition-colors'
                    > 
                        submit feedback 
                    </button>
                </div>
            </DrawerContent>
        </Drawer>
    )
}