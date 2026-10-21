"use client"
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { postType } from '../assets/assets';
import SingleCertificate from './SingleCertificate'; 
import 'swiper/css';

export default function Certificate({ certificates }: { certificates: postType[] }) {
    const certificatesMap = certificates.map((certificate) => (
            <SwiperSlide key={certificate.id}>
                <SingleCertificate certificate={certificate} />
            </SwiperSlide>
    ))

    return (
        <Swiper
            modules={[Pagination]}
            spaceBetween={10}
            slidesPerView={2}
            breakpoints={{
                320: { slidesPerView: 1 },
                650: { slidesPerView: 2 },
                780: { slidesPerView: 3 },
            }}
            pagination={{
                clickable: true,
                renderBullet: function (index: number, className: string) {
                    return '<span class="' + className + '">' + (index + 1) + '</span>';
                },
            }}
            className='items-center flex pb-10'
        >
            {certificatesMap}
        </Swiper>
    )
}