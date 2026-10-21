

"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import subImg from "../../../public/images/doc-removebg-preview.png"
import { SendFill } from 'react-bootstrap-icons'
import "../../reacti18"
import { useTranslation } from 'react-i18next'
import { postType, ProfileType } from '../assets/assets'
import { supabase } from '../assets/supabase-client'
import { useThemeContext } from '../assets/contexts'

export default function CommentForm({ post }: { post: postType }) {
    const [commentText, setCommentText] = useState("")
    const [currentUserId, setCurrentUserId] = useState<string>("")
    const [profile, setProfile] = useState<ProfileType | null>(null)
    const [loading, setLoading] = useState<boolean>(true) 
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false) 
    const [activeAlert , setActiveAlert] = useState<boolean>(false)
    const {mode} = useThemeContext()
    const { t, i18n } = useTranslation()

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true)
            const { data: owner, error: authErr } = await supabase.auth.getUser()
            if (authErr || !owner?.user) {
                console.log("error in getting user", authErr?.message)
                setLoading(false)
                return;
            }

            setCurrentUserId(owner.user.id)

            if (owner?.user?.id) {
                const { data: profileData, error: profileErr } = await supabase
                .from("users") 
                .select("*")
                .eq("id", owner.user.id)
                .single()

            if (profileErr) {
                console.log("error fetching profile", profileErr.message)
            } else {
                setProfile(profileData)
            }
            setLoading(false)
            } else {
                return
            }
        }

        fetchUserProfile()
    }, [])

    const handleAddComment = async () => {

        const { data } = await supabase.auth.getSession()
        
        if (!data.session) {
            setActiveAlert(true)
            setTimeout(() => {
                setActiveAlert(false)
            }, 3000);
            return
        }

        if (!commentText.trim() || isSubmitting) return;
        if (!currentUserId || !post?.id) {
            console.log("Missing user ID or post ID")
            return;
        }

        setIsSubmitting(true)

        const { error } = await supabase
            .from("comments")
            .insert({
                post_id: post.id,
                comment_text: commentText,
                comment_likes: 0,
                owner_id: currentUserId,
                comment_likers: []
            })

        if (error) {
            console.log("error in adding comment", error.message)
        } else {
            setCommentText("") 
        }

        setIsSubmitting(false)
    }

    return (
        <div className='mt-2 grid grid-cols-[65px_1fr] items-center gap-2.5'>
            {loading ? (
                <div className='w-16 h-16 rounded-full bg-gray-500/30 animate-pulse border-4 border-blue-600/40 shrink-0' />
            ) : (
                <Image
                    src={profile?.doctorImage ? profile.doctorImage : subImg}
                    alt='img'
                    width={200}
                    height={200}
                    loading='lazy'
                    className='w-16 h-16 border-4 border-blue-600 rounded-full object-cover shrink-0'
                />
            )}

            <div className='relative w-full'>
                <input
                    type="text"
                    disabled={isSubmitting}
                    placeholder={t("community.placeholder")}
                    className='p-3 border-2 w-full border-blue-600 rounded-3xl outline-none disabled:opacity-60 transition-all'
                    value={commentText}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setCommentText(e.target.value)
                    }}
                    onKeyDown={async (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault()
                            await handleAddComment()
                        }
                    }}
                />

                {isSubmitting ? (
                    <div className={`absolute top-1/2 -translate-y-1/2 ${
                        i18n.dir() === "ltr" ? "right-4" : "left-4"
                    }`}>
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <SendFill 
                        onClick={async (e: React.MouseEvent) => {
                            e.preventDefault()
                            await handleAddComment()
                        }} 
                        className={`absolute top-1/2 -translate-y-1/2 text-blue-600 cursor-pointer text-xl transition-all ${
                            i18n.dir() === "ltr" ? "right-4 rotate-45" : "left-4 rotate-227"
                        } ${commentText.trim() !== "" ? "block hover:scale-110" : "hidden"}`} 
                    />
                )}
            </div>
                <article className={`fixed ${ activeAlert?"top-0" :"-top-full" }  w-75  left-1/2  rounded-3xl z-50 -translate-x-1/2 p-4 text-2xl  text-red-600 ${mode==="light" ? "bg-gray-300" :"bg-[#1e293b]" } `}> {t("community.alert")} </article>
        </div>
    )
}