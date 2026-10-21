"use client"
import React from 'react'
import { QRCodeCanvas } from 'qrcode.react' 
import { ProfileType } from '../assets/assets'
import { useThemeContext } from '../assets/contexts'
import "../../reacti18"
import { useTranslation } from 'react-i18next'

export default function DashboardQRCode({ profile }: { profile: ProfileType }) {
    const { mode } = useThemeContext()
    const doctorProfileUrl = `https://venera-orcin.vercel.app/dashboard/${profile?.id}`
    const {t} = useTranslation()



    return (
        <div className={`${profile?.currentPlan==="free" ? "" : "flex"} flex-col items-center text-center justify-center  p-6 rounded-3xl   ${mode === "light" ? "bg-gray-300 text-black" : "text-white bg-[#1e293b]"} `}>
            <h3 className='text-2xl font-bold mb-2 text-blue-600'>{t('dashboard.qrTitle')}</h3>
            <p className='text-sm  text-center mb-4'>{t('dashboard.qrSubtitle')}</p>
            
            <div className="bg-white p-3 rounded-2xl shadow-md mb-4 flex items-center justify-center">
                <QRCodeCanvas 
                    id="doctor-qr-code"
                    value={doctorProfileUrl} 
                    size={180} 
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"H"} 
                />
            </div>

            <span className='text-xs  bg-blue-950/50 px-3 py-1 rounded-full border border-blue-600/30 break-all text-center mb-4'>
                {doctorProfileUrl}
            </span>

        </div>
    )
}