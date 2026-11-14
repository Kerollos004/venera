/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import Image from 'next/image'
import { useOpenGalleryContext } from '../assets/contexts'
import { Swiper, SwiperSlide } from 'swiper/react'
import {  Navigation } from 'swiper/modules'

// استيراد ملفات الـ CSS الخاصة بـ Swiper
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

export default function Gallery({ images , id }: { images: string[] , id?:string }) {
    const { setOpenGallery, openGallery } = useOpenGalleryContext()



    return (
        <section className={` ${openGallery?"block":"hidden"} fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md p-4 md:p-10`}>
            {/* زر الإغلاق */}
            <button 
                onClick={() => setOpenGallery(false)}
                className="absolute top-6 right-6 text-white bg-slate-800/80 hover:bg-slate-700 font-bold px-4 py-2 rounded-full transition shadow-lg z-50 cursor-pointer"
            >
                ✕ 
            </button>

            <div className="w-full max-w-4xl flex flex-col h-[85vh] justify-center items-center gap-4">
                
                {/* 1. السلايدر الرئيسي (الصور الكبيرة) */}
                <Swiper
                    modules={[ Navigation]}
                    navigation={true}
                    className="w-full h-[65vh] rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shadow-2xl"
                >
                    {images.map((img , index) => (
                        <SwiperSlide key={index} className="flex items-center justify-center relative bg-black">
                            <Image 
                                src={img}
                                alt="gallery slide "
                                className="object-contain"
                                width={200}
                                height={200}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* 2. الصور المصغرة (Thumbnails) تحت السلايدر */}
                <div className="w-full max-w-xl">
                    <Swiper
                        spaceBetween={10}
                        slidesPerView={images.length}
                        className="thumbs-swiper cursor-pointer"
                    >
                        {images.map((imgUrl, index) => (
                            <SwiperSlide 
                                key={index} 
                                className="rounded-lg overflow-hidden border-2 border-transparent transition opacity-60 hover:opacity-100 [&.swiper-slide-thumb-active]:border-blue-500 [&.swiper-slide-thumb-active]:opacity-100"
                            >
                                <div className="relative w-full h-20 bg-slate-800">
                                    <Image 
                                        src={imgUrl}
                                        alt={`thumbnail ${index}`}
                                        
                                        className="object-cover w-10 h-10"
                                        width={200}
                                        height={200}
                                        loading='lazy'

                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

            </div>
        </section>
    )
}