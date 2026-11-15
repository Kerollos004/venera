/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { useOpenGalleryContext, useSelectedPostContext } from '../assets/contexts'
import subImg from "../../../public/images/doc-removebg-preview.png"
import { ArrowLeft, ArrowRight } from 'react-bootstrap-icons'

export default function Gallery({ images , id }: { images: string[] , id?:string }) {
    const { openGallery, setOpenGallery, } = useOpenGalleryContext()
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const { selectedPost } = useSelectedPostContext()
    

    const isOpen = openGallery && selectedPost === id

    const imageArray = Array.isArray(images) ? images : []
    const imgsMap = imageArray.map((img: string, index: number) => {
        return (
            <div key={index} className="w-20 h-20 overflow-hidden rounded-3xl border-2 border-blue-600">
                <Image
                    src={img}
                    alt='img'
                    width={200}
                    height={200}
                    loading='lazy'
                    className='w-full h-full '
                    onClick={() => {
                        setCurrentIndex(index)
                    }}
                />
            </div>
        )
    })

    return (
        <section className={` ${isOpen ? "block" : "hidden"} fixed inset-0 z-50 flex flex-col items-center justify-center w-full min-h-screen overflow-hidden justify-center bg-black/90 backdrop-blur-md p-4 md:p-10`}>
            {/* زر الإغلاق */}
            <button
                onClick={() => {
                    setOpenGallery(false);
                    setCurrentIndex(0);
                }}
                className="absolute top-6 right-6 text-white bg-slate-800/80 hover:bg-slate-700 font-bold w-10 h-10 flex items-center justify-center rounded-full transition shadow-lg z-50 cursor-pointer"
            >
                ✕
            </button>

            <div className="flex w-full justify-center items-center gap-2.5">
<button
    onClick={() => {
        // زر الشمال يرجع للصورة اللي قبلها (ولو عند أول صورة، يروح لآخر صورة)
        setCurrentIndex((prev) => (prev === 0 ? imageArray.length - 1 : prev - 1))
    }}
    className='w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-800 flex items-center justify-center text-2xl text-white cursor-pointer'
>
    <ArrowLeft/>
</button>

<div className="w-[300px] h-[300px] md:w-[850px] md:h-[500px] mb-6 border-2 overflow-hidden rounded-3xl border-blue-600 relative bg-slate-900">
    <Image
        src={imageArray[currentIndex] || subImg }
        alt='Main view'
        fill
        className='object-fill'
    />
</div>

<button
    onClick={() => {
        // زر اليمين يروح للصورة اللي بعدها (ولو عند آخر صورة، يرجع لأول صورة)
        setCurrentIndex((prev) => (prev === imageArray.length - 1 ? 0 : prev + 1))
    }}
    className='w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-800 flex items-center justify-center text-2xl text-white cursor-pointer'
>
    <ArrowRight/>
</button>
            </div>

            <div className="flex flex-wrap gap-3 justify-start md:justify-center ">
                {
                    imageArray.length>0 ? imgsMap : ""
                }
            </div>
        </section>
    )
}