"use client"
import React from 'react'
import { useThemeContext } from '../assets/contexts'
import DashboardPost from './DashboardPost'
import "../../reacti18"
import { useTranslation } from 'react-i18next'
import { ProfileType } from '../assets/assets'
export default function DasboardPosts({profile}:{profile:ProfileType}) {
    const { mode } = useThemeContext()
    const { t } = useTranslation()
    const postsMap = profile?.doctorPosts?.map(post => {
        return (
            <DashboardPost post={post} key={post?.id} />
        )
    })
    return (
        <article className={` ${mode === "light" ? "bg-gray-300" : "bg-[#1e293b]"} rounded-3xl h-100 overflow-y-scroll p-4 `}>
            <h3 className='capitalize text-3xl text-blue-600 mb-2.5'> {t("dashboard.posts")} </h3>
            {postsMap}
        </article>
    )
}
