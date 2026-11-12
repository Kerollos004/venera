/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import React, { useEffect, useState } from 'react'
import { HeartFill, ChatDotsFill } from 'react-bootstrap-icons'
import { useSelectedCommentContext, useThemeContext } from '../assets/contexts'
import "../../reacti18"
import { postType } from '../assets/assets'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import { supabase } from '../assets/supabase-client'

export default function PostContent({ post }: { post: postType }) {
    const [heart, setHeart] = useState(false)
    const [reacts, setReacts] = useState<number>(post.likes ? post?.likes : 0)
    const [comments, setComments] = useState<number>(0)
    const [more, setMore] = useState<boolean>(false)
    const { mode } = useThemeContext()
    const { setSelectedComment } = useSelectedCommentContext()
    const limit = 150;
    const { t } = useTranslation()

    // طريقة آمنة لجلب الـ userId من السيشن مباشرة بدون أخطاء على Vercel
    const getUserIdFromSession = async () => {
        const { data: { session }, error: sessionErr } = await supabase.auth.getSession()
        if (sessionErr || !session) {
            return null;
        }
        return session.user?.id;
    }

    const checkUserLikeStatus = async () => {
        const userId = await getUserIdFromSession();
        if (userId) {
            const oldLikers: string[] = post?.post_likers || [];
            if (oldLikers.includes(userId)) {
                setHeart(true);
            } else {
                setHeart(false);
            }
        }
    }

    useEffect(() => {
        checkUserLikeStatus()
    }, [post?.post_likers])

    const handleDisplayPostComments = async () => {
        const { data, error } = await supabase
            .from("comments")
            .select("*") 
            .eq("post_id", post?.id)    

        if (error) {
            console.log("error in getting post comments", error.message);
        }
        if (data) {
            setComments(data?.length);
        }
    }

    useEffect(() => {
        handleDisplayPostComments();
    }, []); 

    const handleReact = async () => {
        const ownerId = await getUserIdFromSession();
        if (!ownerId) {
            console.log("User not logged in");
            return;
        }

        const oldLovers: string[] = post?.post_likers ? post?.post_likers : []
        const newHeartState = !heart
        
        let updatedLovers: string[] = []
        if (newHeartState) {
            updatedLovers = [...oldLovers, ownerId]
        } else {
            updatedLovers = oldLovers.filter(id => id !== ownerId)
        }

        // تحديث الـ UI فوراً
        setHeart(newHeartState)
        const newCount = newHeartState ? reacts + 1 : Math.max(0, reacts - 1)
        setReacts(newCount)

        // تحديث الداتابيز للـ likes و post_likers بطلب واحد نظيف
        const { error } = await supabase
            .from("posts")
            .update({ 
                likes: newCount,
                post_likers: updatedLovers 
            })
            .eq("id", post?.id);
            
        if (error) {
            console.log("error in updating like", error.message);
            // لو حصل خطأ بنرجع القيمة القديمة
            setHeart(!newHeartState)
            setReacts(reacts)
        } else {
            post.post_likers = updatedLovers;
            post.likes = newCount;
        }
    }
    
    const handleDoubleReact = async () => {
        if (heart) return; 
        await handleReact();
    }

    return (
        <div className=''>
            <div className="">
                <h3 className='mb-2.5 text-3xl'> {post.name} </h3>
                <p className="mb-2.5">
                    {more ? post.description : `${post.description?.substring(0, limit)}`}
                    
                    {(post.description?.length ?? 0) > limit && (
                        <span 
                            onClick={() => setMore(!more)} 
                            className="text-blue-500 cursor-pointer font-bold ml-2 hover:underline"
                        >
                            {more ? t("community.seeLess") : t("community.seeMore")}
                        </span>
                    )}
                </p>
            </div>

            {/* لو فيه صورة بنعرضها ومعاها الأيقونات Absolute */}
            {post?.image ? (
                <div className="relative mt-2.5"> 
                    <Image
                        onDoubleClick={handleDoubleReact}
                        src={post.image}
                        alt='case image'
                        width={400}
                        height={400}
                        draggable={false}
                        className='w-full h-82  rounded-xl'
                        loading='lazy'
                    />
                    
                    {/* الأيقونات فوق الصورة */}
                    <div className={`absolute bottom-4 left-4 flex py-2 px-4 ${mode === "light" ? "bg-gray-300 text-black" : "bg-[#101620] text-white"} rounded-3xl gap-2.5 shadow-md`}>
                        <div className={`flex items-center gap-1.5`}>
                            <HeartFill
                                className={`cursor-pointer ${heart ? "text-red-500" : ""}`}
                                onClick={async () => {
                                    await handleReact()
                                }}
                            />
                            <span> {reacts} </span>
                        </div>
                        <div className={`flex items-center gap-1.5`}>
                            <ChatDotsFill 
                                onClick={() => {
                                    setSelectedComment(post?.id ? post?.id : '')
                                }}
                                className={`cursor-pointer`}
                            />
                            <span> {comments} </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={`mt-3 flex w-fit py-2 px-4 ${mode === "light" ? "bg-gray-300 text-black" : "bg-[#101620] text-white"} rounded-3xl gap-2.5 shadow-sm`}>
                    <div className={`flex items-center gap-1.5`}>
                        <HeartFill
                            className={`cursor-pointer ${heart ? "text-red-500" : ""}`}
                            onClick={async () => {
                                await handleReact()
                            }}
                        />
                        <span> {reacts} </span>
                    </div>
                    <div className={`flex items-center gap-1.5`}>
                        <ChatDotsFill 
                            onClick={() => {
                                setSelectedComment(post?.id ? post?.id : '')
                            }}
                            className={`cursor-pointer`}
                        />
                        <span> {comments} </span>
                    </div>
                </div>
            )}
        </div>
    )
}