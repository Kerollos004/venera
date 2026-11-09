
"use client"
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { feedBack } from '../assets/assets';
import SingleDoctorFeedback from './SingleDoctorFeedback';
import 'swiper/css';

export default function Feedback({ feedbacks }: { feedbacks: feedBack[] }) {
    const feedbacksMap = feedbacks.map((feedback) => (
        <SwiperSlide key={feedback.id }>
            <SingleDoctorFeedback feedback={feedback} />
        </SwiperSlide>
    ))

    return (
        <Swiper
            modules={[Pagination]}
            spaceBetween={15}
            slidesPerView={1}
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
            className='w-full py-4 pb-12'
        >
            {feedbacksMap}
        </Swiper>
    )
}