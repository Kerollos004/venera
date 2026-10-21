
"use client"
import React from 'react'
import { useOpenCheckoutContext, useThemeContext } from '../assets/contexts'
import { CheckCircleFill } from 'react-bootstrap-icons'
import Image from 'next/image'
import "../../reacti18"
import { useTranslation } from 'react-i18next'
import freeImg from "../../../public/images/water-removebg-preview.png"
import proImg from "../../../public/images/matcha-removebg-preview.png"
import primImg from "../../../public/images/pizza-removebg-preview.png"
import bannerImg from "../../../public/images/doc-removebg-preview.png"
export default function Plans() {
    const { mode } = useThemeContext()
    const { setOpenCheckout } = useOpenCheckoutContext()
    const { t } = useTranslation()

    return (
        <main className={`${mode === "dark" ? "dark-mode" : "light-mode"} w-full min-h-screen md:pt-20 py-10 bg-fixed px-3.5 md:px-10`}>
            
            {/* عنوان الصفحة */}
            <article className='flex flex-col items-center my-7 md:mb-12'>
                <h3 className='text-blue-600 text-5xl font-bold text-center mb-2.5'>{t("pricing.hero_title")}</h3>
                <p className={`text-2xl text-center ${mode === "light" ? "text-black" : "text-white"}`}>
                    {t("pricing.hero_subtitle")}
                </p>

            <article className={`p-3 mt-3 w-fit rounded-bl-4xl rounded-tl-4xl rounded-tr-4xl border-2 border-blue-600  flex items-center  gap-2.5  ${mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"}  `}  >
                <Image src={bannerImg} alt='img' width={200} height={200} loading='lazy' className='w-20 border border-blue-600 rounded-full h-20' />
                <h3 className='text-blue-600 text-2xl'> {t("banners.freeExperince")} </h3>
            </article>
            </article>

            {/* شبكة الكارتات */}
            <article className='grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-10 md:gap-5 '>
                
                {/* 1. Free Plan */}
                <article className={ ` hover:-translate-y-1.5 ${mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"} px-4 rounded-2xl relative overflow-hidden border-t-[6px] border-blue-600 py-20 flex flex-col justify-between`}>
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className='font-semibold text-2xl mb-2 text-blue-600'>{t("pricing.plans.free.type")}</h3>
                                <h3 className='font-bold text-4xl mb-1 text-blue-600'>{t("pricing.plans.free.price")} EGP</h3>
                            </div>
                            <div className='p-3 rounded-2xl bg-black/10'>
                            <Image src={freeImg} alt='img' width={200} height={200} loading="lazy" className='w-18 rotate-45 h-18 rounded-full' />
                            </div>
                        </div>
                        <p className="text-2xl text-center mb-3.5">{t("pricing.plans.free.description")}</p>
                        <div className=" mb-6">
                            <p className=' mb-2 pl-10 flex items-center gap-2.5'>
                                    <CheckCircleFill className='shrink-0'  /> {t("pricing.plans.free.benefits.0")}
                            </p>
                            <p className=' mb-2 pl-10 flex items-center gap-2.5'>
                                    <CheckCircleFill className='shrink-0'  /> {t("pricing.plans.free.benefits.1")}
                            </p>
                            <p className=' mb-2 pl-10 flex items-center gap-2.5'>
                                    <CheckCircleFill className='shrink-0'  /> {t("pricing.plans.free.benefits.2")}
                            </p>
                            <p className=' mb-2 pl-10 flex items-center gap-2.5'>
                                    <CheckCircleFill className='shrink-0'  /> {t("pricing.plans.free.benefits.3")}
                            </p>
                            <p className=' mb-2 pl-10 flex  items-center gap-2.5'>
                                    <CheckCircleFill  className='shrink-0' /> {t("pricing.plans.free.benefits.4")}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setOpenCheckout(true)} className='p-2.5 w-full text-center text-[19px]  text-white bg-blue-600 hover:bg-blue-900 absolute bottom-0 left-0'>
                        {t("pricing.plans.free.buttonText")}
                    </button>
                </article>

                {/* 2. Pro Plan */}
                <article className={`lg:scale-105 hover:-translate-y-1.5 ${mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"} px-4 rounded-2xl relative overflow-hidden border-t-8 border-blue-600 py-20 flex flex-col justify-between`}>
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className='font-semibold text-2xl mb-2 text-blue-600'>{t("pricing.plans.pro.type")}</h3>
                                <h3 className='font-bold text-4xl mb-1 text-blue-600'>{t("pricing.plans.pro.price")} EGP</h3>
                            </div>
                            <div className='p-3 rounded-2xl bg-black/10'>
                            <Image src={proImg} alt='img' width={200} height={200} loading="lazy" className='w-18 rotate-45 h-18 rounded-full' />
                            </div>
                        </div>
                        <p className="text-2xl text-center mb-3.5">{t("pricing.plans.pro.description")}</p>
                        <div className=" mb-6">
                            <p className=' mb-2 pl-10 flex items-center gap-2.5'>
                                    <CheckCircleFill  className='shrink-0' /> {t("pricing.plans.pro.benefits.0")}
                            </p>
                            <p className=' mb-2 pl-10 flex items-center gap-2.5'>
                                    <CheckCircleFill  className='shrink-0' /> {t("pricing.plans.pro.benefits.1")}
                            </p>
                            <p className=' mb-2 pl-10 flex items-center gap-2.5'>
                                    <CheckCircleFill className='shrink-0'  /> {t("pricing.plans.pro.benefits.2")}
                            </p>
                            <p className=' mb-2 pl-10 flex items-center gap-2.5'>
                                    <CheckCircleFill  className='shrink-0' /> {t("pricing.plans.pro.benefits.3")}
                            </p>
                            <p className=' mb-2 pl-10 flex items-center gap-2.5'>
                                    <CheckCircleFill   /> {t("pricing.plans.pro.benefits.4")}
                            </p>
                            <p className=' mb-2 pl-10 flex items-center gap-2.5'>
                                    <CheckCircleFill className='shrink-0'  /> {t("pricing.plans.pro.benefits.5")}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setOpenCheckout(true)} className='p-2.5 w-full text-center text-[19px] text-white bg-blue-600 hover:bg-blue-900 absolute bottom-0 left-0'>
                        {t("pricing.plans.pro.buttonText")}
                    </button>
                    <span className="p-3.5 bg-blue-600 text-white rounded-br-4xl absolute top-0 right-0">
                        {t("pricing.plans.pro.badge", { defaultValue: "most popular" })}
                    </span>
                </article>

                {/* 3. Business Plan */}
                <article className={` hover:-translate-y-1.5 ${mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"} px-4 rounded-2xl relative overflow-hidden border-t-[6px] border-blue-600 py-20 flex flex-col justify-between`}>
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className='font-semibold text-2xl mb-2 text-blue-600'>{t("pricing.plans.business.type")}</h3>
                                <h3 className='font-bold text-4xl mb-1 text-blue-600'>{t("pricing.plans.business.price")} EGP</h3>
                            </div>
                            <div className='p-3 rounded-2xl bg-black/10'>
                                <Image src={primImg} alt='img' width={200} height={200} loading="lazy" className='w-18 rotate-45 h-18 rounded-full' />
                            </div>
                        </div>
                        <p className="text-2xl text-center mb-3.5">{t("pricing.plans.business.description")}</p>
                        <div className="  mb-6">
                            <p className=' mb-2 pl-10 flex  items-center gap-2.5'>
                                    <CheckCircleFill className='shrink-0'  /> {t("pricing.plans.business.benefits.0")}
                            </p>
                            <p className=' mb-2 pl-10 flex items-center gap-2.5'>
                                    <CheckCircleFill  className='shrink-0' /> {t("pricing.plans.business.benefits.1")}
                            </p>
                            <p className=' mb-2 pl-10 flex items-center gap-2.5'>
                                    <CheckCircleFill className='shrink-0'  /> {t("pricing.plans.business.benefits.2")}
                            </p>
                            <p className=' mb-2 pl-10 flex items-center gap-2.5'>
                                    <CheckCircleFill className='shrink-0'  /> {t("pricing.plans.business.benefits.3")}
                            </p>
                            <p className=' mb-2 pl-10 flex items-center gap-2.5'>
                                    <CheckCircleFill className='shrink-0'  /> {t("pricing.plans.business.benefits.4")}
                            </p>
                            <p className=' mb-2 pl-10 flex items-center gap-2.5'>
                                    <CheckCircleFill  className='shrink-0' /> {t("pricing.plans.business.benefits.5")}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setOpenCheckout(true)} className='p-2.5 w-full text-center text-[19px] text-white bg-blue-600 hover:bg-blue-900 absolute bottom-0 left-0'>
                        {t("pricing.plans.business.buttonText")}
                    </button>
                    <span className={`p-3.5 ${mode === "light" ? "bg-gray-400" :" bg-gray-700"} text-white rounded-br-4xl absolute top-0 right-0`}>
                        {t("pricing.plans.business.badge", { defaultValue: "coming soon" })}
                    </span>
                </article>

            </article>

        </main>
    )
}