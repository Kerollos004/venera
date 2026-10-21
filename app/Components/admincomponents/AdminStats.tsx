"use client"
import React from 'react'
import { useThemeContext } from '../assets/contexts'
import { ProfileType } from '../assets/assets'

export default function AdminStats( {stats} : {stats:ProfileType[]} ) {
    const { mode } = useThemeContext()
    const proUsers = stats.filter(stat => stat.doctorType === "pro")
    const premiumUsers = stats.filter(stat => stat.doctorType === "premium" )
    return (
        <section className=' grid grid-cols-1 mb-3 md:grid-cols-4 gap-2.5 '>
            <article className={`p-4 rounded-3xl  ${mode==="light"?"bg-gray-300 text-black":"text-white bg-[#1e293b]"} `}>
                <h3 className='text-2xl mb-2 text-blue-600'>all clients</h3>
                <h3 className='text-4xl text-blue-600'>  {stats.length} </h3>
            </article>

            <article className={`p-4 rounded-3xl  ${mode==="light"?"bg-gray-300 text-black":"text-white bg-[#1e293b]"} `}>
                <h3 className='text-2xl mb-2 text-blue-600'>pro clients</h3>
                <h3 className='text-4xl text-blue-600'>  
                    {proUsers.length}
                </h3>
            </article>

            <article className={`p-4 rounded-3xl  ${mode==="light"?"bg-gray-300 text-black":"text-white bg-[#1e293b]"} `}>
                <h3 className='text-2xl mb-2 text-blue-600'> premium clients</h3>
                <h3 className='text-4xl text-blue-600'>
                    {premiumUsers.length}
                </h3>
            </article>

            <article className={`p-4 rounded-3xl  ${mode==="light"?"bg-gray-300 text-black":"text-white bg-[#1e293b]"} `}>
                <h3 className='text-2xl mb-2 text-blue-600'>total revenue</h3>
                <h3 className='text-4xl text-blue-600'>00</h3>
            </article>
        </section>
    )
}
