"use client"
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { postType } from '../assets/assets';
import SingleAchievement from './SingleAchieve';
import 'swiper/css';

export default function Achievments({ achievements }: { achievements: postType[] }) {
    const achievementsMap =  achievements.map((achievement) => (
            <SwiperSlide key={achievement.id}>
                <SingleAchievement achievement={achievement} />
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
            className='  relative pb-10'
        >
            {achievementsMap} 
        </Swiper>
    )
}