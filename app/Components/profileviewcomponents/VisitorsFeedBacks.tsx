"use client"
import React from 'react'
import 'swiper/css';
import {  feedBack, ProfileType } from '../assets/assets';
import { useThemeContext } from '../assets/contexts';
import VisitorFeedBack from './VisitorFeedBack';
export default function VisitorsFeedBacks({ profile , feedBacks }: { profile: ProfileType , feedBacks:feedBack[] }) {
    
    const { mode } = useThemeContext()
    const feedBacksMap = feedBacks.map(feedBack => {
        return (
            <VisitorFeedBack profile={profile} key={feedBack?.id} feedBack={feedBack} />
        )
    })
    return (
        <article className={`p-3 rounded-2xl ${mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"} border-b-8 border-blue-600`} >
            <h3 className='text-3xl font-bold text-blue-600 mb-3.5' > feedBacks </h3>
            {
                feedBacks.length>0 ? feedBacksMap : <h3 className='capitalize text-blue-600 text-center text-2xl' > no feedBacks yet </h3>
            }
        </article>
    )
}
