/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import React, { useEffect } from 'react'
import { useState } from 'react'
import { HeartFill , ChatDotsFill } from 'react-bootstrap-icons'
import { useOpenGalleryContext, useSelectedCommentContext, useSelectedPostContext, useThemeContext } from '../assets/contexts'

import "../../reacti18"
import { postType  } from '../assets/assets'
import { useTranslation } from 'react-i18next'
import Gallery from '../basiccomponents/Gallery'
import Image from 'next/image'
import { supabase } from '../assets/supabase-client'

export default function PostContent({ post }: { post: postType }) {
    const [heart, setHeart] = useState(false)
    const [reacts, setReacts] = useState<number>(post.likes ? post?.likes : 0)
    const [comments, setComments] = useState<number>(0)
    const [more , setMore] = useState<boolean>(false)
    const { mode } = useThemeContext()
    const {setSelectedComment} = useSelectedCommentContext()
    const limit = 150;
    const { t } = useTranslation()
    const { setOpenGallery } = useOpenGalleryContext()
    const { setSelectedPost } = useSelectedPostContext()

    // توحيد الصور في Array (دعم images الجديدة أو image القديمة كـ Array أو String)
    const postImages: string[] = Array.isArray(post?.images) && post.images.length > 0
        ? post.images
        : Array.isArray(post?.images)
            ? post.images
            : typeof post?.images === 'string' && post.images
                ? [post.images]
                : [];

    const checkUserLikeStatus = async () => {
        const { data: {session}, error: authErr } = await supabase.auth.getSession()
        if (authErr || !session) {
            console.log("error in getting user", authErr?.message)
            return;
        }

        const userId = session?.user?.id;
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
        setHeart(!heart);
        const newCount = !heart ? reacts + 1 : reacts - 1 
        setReacts(newCount)
        const { error } = await supabase
            .from("posts")
            .update({ likes: newCount })
            .eq("id", post?.id);
        
        await handleAddLikeOwner()
        if (error) {
            console.log("error in adding like", error.message);
        };
    }
    
    const handleDoubleReact = async () => {
        if (heart) return; 
        setHeart(true);
        const newCount = reacts + 1;
        setReacts(newCount)
        const { error } = await supabase
            .from("posts")
            .update({ likes: newCount })
            .eq("id", post?.id);
        
        if (error) {
            console.log("error in adding like", error.message);
        };
        await handleAddLikeOwner()
    }

    const handleAddLikeOwner = async () => {
        const { data: owner, error: authErr } = await supabase.auth.getUser()
        if (authErr || !owner.user) {
            console.log("error in getting user", authErr?.message)
            return;
        }
        const ownerId = owner?.user?.id
        const oldLovers: string[] = post?.post_likers ? post?.post_likers : []
        const updatedLovers: string[] = [...oldLovers, ownerId]
        if (!heart) {
            const { error: updateErr } = await supabase.from("posts").update({ post_likers: updatedLovers }).eq("id", post?.id)
            if (updateErr) {
                console.log("error in adding like owner", updateErr.message);
            }
        } else {
            const updatedLoverDelete = updatedLovers.filter(id => id !== ownerId)
            if (updatedLoverDelete) {
                const { error: updateErr } = await supabase.from("posts").update({ post_likers: updatedLoverDelete }).eq("id", post?.id)
                if (updateErr) {
                    console.log("error in removing like owner", updateErr.message);
                }
            }
        }
    }

    const hasMoreImages = postImages.length > 3;
    const displayedImages = hasMoreImages ? postImages.slice(0, 2) : postImages;
    const extraImagesCount = postImages.length - 2;

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

            {/* عرض الصور (متعددة أو واحدة) ومعاها الأيقونات */}
            {postImages.length > 0 ? (
                <div className="relative mt-2.5"> 
                    <div className={`grid gap-2 rounded-xl overflow-hidden ${
                        postImages.length === 1 ? 'grid-cols-1' :
                        postImages.length === 2 ? 'grid-cols-2' :
                        'grid-cols-2' 
                    }`}>
                        {/* عرض أول صورتين أو الصورة الوحيدة */}
                        {displayedImages.map((imgUrl, index) => (
                            <div 
                                key={index} 
                                className={`relative w-full overflow-hidden rounded-xl bg-slate-800 ${
                                    postImages.length === 1 ? 'h-[400px]' : 'h-56'
                                }`}
                            >
                                <Image
                                    onDoubleClick={handleDoubleReact}
                                    src={imgUrl}
                                    alt={`post image ${index}`}
                                    fill
                                    draggable={false}
                                    loading='lazy'
                                />
                            </div>
                        ))}

                        {/* لو عدد الصور أكبر من 2، بنعرض الكارت التالت جنبهم في الشبكة */}
                        {hasMoreImages && (
                            <div 
                                onClick={() => {
                                    setOpenGallery(true)
                                    setSelectedPost(post?.id ? post?.id:"")
                                }}
                                className="relative w-full h-56 overflow-hidden rounded-xl bg-slate-800/90 border-2 border-dashed border-slate-600 cursor-pointer flex flex-col items-center justify-center text-white transition hover:bg-slate-800 hover:border-blue-500 group"
                            >
                                {/* ممكن تحط صورة مصغرة خلفية خفيفة أو تسيبه كارت رايق */}
                                <div className="absolute inset-0 opacity-20">
                                    <Image
                                        src={postImages[2]}
                                        alt="background extra"
                                        fill
                                    />
                                </div>
                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-extrabold text-blue-400 mb-1">
                                        +{extraImagesCount}
                                    </span>
                                    <span className="text-xs font-semibold tracking-wider uppercase text-gray-300">
                                        {t("community.seeMore")}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* الأيقونات فوق الصورة لو صورة واحدة، أو تحت الشبكة لو صور متعددة */}
                    <div className={`${postImages.length === 1 ? 'absolute bottom-4 left-4 z-10' : 'mt-3 w-fit'} flex py-2 px-4 ${mode === "light" ? "bg-gray-300 text-black" : "bg-[#101620] text-white"} rounded-3xl gap-2.5 shadow-md`}>
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
            <Gallery id={post?.id ? post?.id : ''} images={post?.images ? post?.images :[]}/>
        </div>
    )
}