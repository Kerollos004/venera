"use client"
import React from 'react'
import { useThemeContext } from '../assets/contexts'
import AdminClient from './AdminClient'
import { ProfileType } from '../assets/assets'
export default function AdminClients({profiles} : {profiles:ProfileType[]}) {
    const { mode } = useThemeContext()
    const prodilesMap = profiles.map(profile => {
        return (
            <AdminClient key={profile.id} profile={profile}/>
        )
    })
    return (
        <article className={`p-4 rounded-3xl  ${mode === "light" ? "bg-gray-300 text-black" : "text-white bg-[#1e293b]"} `}>
            <h3 className='text-blue-600 mb-2.5 text-3xl '> all clients  </h3>
            {prodilesMap}
        </article>
    )
}
