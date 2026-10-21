/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { postType , CommentType } from '../assets/assets'
import { HeartFill, ChatDotsFill } from 'react-bootstrap-icons'
import { supabase } from '../assets/supabase-client'
import { useThemeContext, useSelectedCommentContext } from '../assets/contexts'
import { useTranslation } from 'react-i18next'
import CommentForm from '../comments/CommentForm'
import PostComment from '../comments/PostComment'
export default function SingleAchievement({ achievement }: { achievement: postType }) {
    const [heart, setHeart] = useState(false)
    const [reacts, setReacts] = useState<number>(achievement?.likes ? achievement?.likes : 0)
    const [more, setMore] = useState<boolean>(false)
        const [comments, setComments] = useState<CommentType[]>([])
    
    const limit = 150
    const { mode } = useThemeContext()
    const { setSelectedComment } = useSelectedCommentContext()
    const { t } = useTranslation()

    useEffect(() => {
        const checkUserLikeStatus = async () => {
            const { data: owner, error: authErr } = await supabase.auth.getUser()
            if (authErr) {
                console.log("error in getting user", authErr.message)
                return;
            }

            const userId = owner?.user?.id;
            if (userId) {
                const oldLikers: string[] = achievement?.post_likers || [];
                if (oldLikers.includes(userId)) {
                    setHeart(true);
                } else {
                    setHeart(false);
                }
            }
        }

        checkUserLikeStatus()
    }, [achievement?.post_likers])

    // تحديث قائمة المعجبين في الداتابيز
    const handleAddLikeOwner = async () => {
        const { data: owner, error: authErr } = await supabase.auth.getUser()
        if (authErr) {
            console.log("error in getting owner" , authErr.message)
        } ;
        
        const ownerId = owner?.user?.id;
        if (!ownerId) return;

        const oldLovers: string[] = achievement?.post_likers || [];

        if (!heart) {
            const updatedLovers = oldLovers.includes(ownerId) ? oldLovers : [...oldLovers, ownerId];
            await supabase.from("posts").update({ post_likers: updatedLovers }).eq("id", achievement?.id);
        } else {
            const updatedLoverDelete = oldLovers.filter(id => id !== ownerId);
            await supabase.from("posts").update({ post_likers: updatedLoverDelete }).eq("id", achievement?.id);
        }
    }

    const addLikesToDb = async (count: number) => {
        await supabase.from("posts").update({ likes: count }).eq("id", achievement?.id);
    }

    const handleReact = async () => {
        const newHeartState = !heart;
        setHeart(newHeartState);
        const newCount = newHeartState ? reacts + 1 : reacts - 1;
        setReacts(newCount);
        await addLikesToDb(newCount);
        await handleAddLikeOwner();
    }

    const handleDoubleReact = async () => {
        if (heart) return;
        setHeart(true);
        const newCount = reacts + 1;
        setReacts(newCount);
        await addLikesToDb(newCount);
        await handleAddLikeOwner();
    }

        const getAchievementComments = async () => {
            const { data, error } = await supabase.from("comments").select("*").eq("post_id", achievement?.id)
            if (error) {
                console.log("error im getting comments" , error.message)
            }
            if (data) {
                setComments(data)
            }
        }
        useEffect(() => {
            getAchievementComments()
        } , [])
    return (
        <div className={`p-4 relative rounded-2xl ${mode === "light" ? "bg-white text-black" : "bg-[#102034] text-white"}`}>
    {achievement.name ? <h3 className='mb-1 text-2xl text-blue-600 capitalize'>{achievement.name}</h3> : ""}
    
    {achievement?.description ? (
        <p className="mb-3">
            {more ? achievement.description : `${achievement.description?.substring(0, limit)}`}
            {achievement.description?.length > limit && (
                <span
                    onClick={() => setMore(!more)}
                    className="text-blue-500 cursor-pointer font-bold ml-2 hover:underline"
                >
                    {more ? t("community.seeLess") : t("community.seeMore")}
                </span>
            )}
        </p>
    ) : ""}

    {achievement?.image ? (
        <div className="relative w-full h-[300px] rounded-xl overflow-hidden mt-2">
            <Image
                onDoubleClick={handleDoubleReact}
                src={achievement.image}
                alt='img'
                fill
                className='object-cover'
                loading='lazy'
            /> 

            <div className={`absolute bottom-3 left-3 flex py-1.5 px-3.5 ${mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"} rounded-3xl gap-2.5 shadow-md z-10`}>
                <div className={`flex items-center gap-1.5`}>
                    <HeartFill
                        className={`cursor-pointer text-lg ${heart ? "text-red-500" : ""}`}
                        onClick={handleReact}
                    />
                    <span>{reacts}</span>
                </div>
                <div className={`flex items-center gap-1.5`}>
                    <ChatDotsFill 
                        onClick={() => setSelectedComment(achievement?.id ? achievement?.id : '')}
                        className={`cursor-pointer text-lg`}
                    />
                    <span> {comments.length} </span>
                </div>
            </div>
        </div>
    ) : (
        <div className={`mt-3 flex w-fit py-1.5 px-3.5 ${mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"} rounded-3xl gap-2.5 shadow-sm`}>
            <div className={`flex items-center gap-1.5`}>
                <HeartFill
                    className={`cursor-pointer text-lg ${heart ? "text-red-500" : ""}`}
                    onClick={handleReact}
                />
                <span>{reacts}</span>
            </div>
            <div className={`flex items-center gap-1.5`}>
                <ChatDotsFill 
                    onClick={() => setSelectedComment(achievement?.id ? achievement?.id : '')}
                    className={`cursor-pointer text-lg`}
                />
                <span> {comments.length} </span>
            </div>
        </div>
    )}

    <div className="mt-4">
        <PostComment postId={achievement?.id ? achievement?.id : ""} />
        <CommentForm post={achievement} />
    </div>
</div>
    )
}