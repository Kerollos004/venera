
"use client"
import React from 'react'
import { Search } from 'react-bootstrap-icons'
import { useOpenSearchDoctorsContext, useThemeContext } from '../assets/contexts'
export default function MobSearchIcon() {
    const { setOpenSearchDoctors, } = useOpenSearchDoctorsContext()
    const {mode} = useThemeContext()
    return (
        <button
            className={`  ${mode==="light"?"text-black":"text-white"} fixed md:hidden top-5 right-5 z-30 text-2xl `}
            onClick={() => {
            setOpenSearchDoctors(true)
        }}>
            <Search/>
        </button>
    )
}
