/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { postType, CommentType } from '../assets/assets'
import { HeartFill, ChatDotsFill } from 'react-bootstrap-icons'
import { supabase } from '../assets/supabase-client'
import { useThemeContext, useSelectedCommentContext, useOpenGalleryContext, useSelectedPostContext } from '../assets/contexts'
import { useTranslation } from 'react-i18next'
import CommentForm from '../comments/CommentForm'
import PostComment from '../comments/PostComment'
import Gallery from '../basiccomponents/Gallery'

export default function SingleCertificate({ certificate }: { certificate: postType }) {
    const [heart, setHeart] = useState(false)
    const [reacts, setReacts] = useState<number>(certificate?.likes || 0)
    const [comments, setComments] = useState<CommentType[]>([])
    const [more, setMore] = useState<boolean>(false)
    const limit = 150
    const { mode } = useThemeContext()
    const { setSelectedComment } = useSelectedCommentContext()
    const { t } = useTranslation()
    const { setOpenGallery } = useOpenGalleryContext()
    const {setSelectedPost} = useSelectedPostContext()

    // توحيد الصور في Array (سواء كانت في images أو image القديمة)
    const certImages: string[] = Array.isArray(certificate?.images) && certificate.images.length > 0
        ? certificate.images
        : Array.isArray((certificate as any)?.image)
            ? (certificate as any).image
            : typeof (certificate as any)?.image === 'string' && (certificate as any).image
                ? [(certificate as any).image]
                : [];

    const checkUserLikeStatus = async () => {
        const { data: owner, error: authErr } = await supabase.auth.getUser()
        if (authErr) {
            console.log("error in getting user", authErr.message)
            return;
        }

        const userId = owner?.user?.id;
        if (userId) {
            const oldLikers: string[] = certificate?.post_likers || [];
            if (oldLikers.includes(userId)) {
                setHeart(true);
            } else {
                setHeart(false);
            }
        }
    }
        
    useEffect(() => {
        checkUserLikeStatus()
    }, [])

    const handleAddLikeOwner = async () => {
        const { data: owner, error: authErr } = await supabase.auth.getUser()
        if (authErr) return;
        
        const ownerId = owner?.user?.id;
        if (!ownerId) return;

        const oldLovers: string[] = certificate?.post_likers || [];

        if (!heart) {
            const updatedLovers = oldLovers.includes(ownerId) ? oldLovers : [...oldLovers, ownerId];
            await supabase.from("posts").update({ post_likers: updatedLovers }).eq("id", certificate?.id);
        } else {
            const updatedLoverDelete = oldLovers.filter(id => id !== ownerId);
            await supabase.from("posts").update({ post_likers: updatedLoverDelete }).eq("id", certificate?.id);
        }
    }

    const addLikesToDb = async (count: number) => {
        await supabase.from("posts").update({ likes: count }).eq("id", certificate?.id);
    }

    const handleReact = async () => {
        const newHeartState = !heart;
        setHeart(newHeartState);
        const newCount = newHeartState ? reacts + 1 : Math.max(0, reacts - 1);
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

    const getCertificateComments = async () => {
        const { data, error } = await supabase.from("comments").select("*").eq("post_id", certificate?.id)
        if (error) {
            console.log("error in getting comments" , error.message)
        }
        if (data) {
            setComments(data)
        }
    }

    useEffect(() => {
        getCertificateComments()
    }, [])

    // منطق العرض للصور (أول صورتين لو أكتر من 2، والكارت التالت جنبهم)
    const hasMoreImages = certImages.length > 2;
    const displayedImages = hasMoreImages ? certImages.slice(0, 2) : certImages;
    const extraImagesCount = certImages.length - 2;

    return (
        <div className={`p-4 relative rounded-2xl ${mode === "light" ? "bg-white text-black" : "bg-[#102034] text-white"}`}>
            {certificate.name ? <h3 className='mb-1 text-2xl text-blue-600 capitalize'>{certificate.name}</h3> : ""}
            
            {certificate?.description ? (
                <p className="mb-3">
                    {more ? certificate.description : `${certificate.description?.substring(0, limit)}`}
                    {certificate.description?.length > limit && (
                        <span
                            onClick={() => setMore(!more)}
                            className="text-blue-500 cursor-pointer font-bold ml-2 hover:underline"
                        >
                            {more ? t("community.seeLess") : t("community.seeMore")}
                        </span>
                    )}
                </p>
            ) : ""}

            {certImages.length > 0 ? (
                <div className="relative mt-2">
                    <div className={`grid gap-2 rounded-xl overflow-hidden ${
                        certImages.length === 1 ? 'grid-cols-1' :
                        certImages.length === 2 ? 'grid-cols-2' :
                        'grid-cols-3'
                    }`}>
                        {displayedImages.map((imgUrl, index) => (
                            <div
                                key={index}
                                className={`relative w-full overflow-hidden rounded-lg bg-slate-800 ${
                                    certImages.length === 1 ? 'h-[400px]' : 'h-56'
                                }`}
                            >
                                <Image
                                    onDoubleClick={handleDoubleReact}
                                    src={imgUrl}
                                    alt={`certificate image ${index}`}
                                    fill
                                    draggable={false}
                                    className='object-cover cursor-pointer hover:scale-105 transition duration-300'
                                    loading='lazy'
                                />
                            </div>
                        ))}

                        {/* كارت عرض المزيد الـ +N */}
                        {hasMoreImages && (
                            <div 
                                onClick={() => {
                                    setOpenGallery(true)
                                    setSelectedPost(certificate?.id ? certificate?.id:"")
                                }}
                                className="relative w-full h-56 overflow-hidden rounded-lg bg-slate-900 border-2 border-slate-700 cursor-pointer flex flex-col items-center justify-center text-white transition hover:border-blue-500 group"
                            >
                                <div className="absolute inset-0 opacity-20">
                                    <Image
                                        src={certImages[2]}
                                        alt="extra background"
                                        fill
                                        className="object-cover group-hover:scale-105 transition duration-300"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-extrabold text-blue-400 mb-1">
                                        +{extraImagesCount}
                                    </span>
                                    <span className="text-xs font-semibold tracking-wider uppercase text-gray-300">
                                        {t("community.seeMore")}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* زر اللايك والكومنت */}
                    <div className={`${certImages.length === 1 ? 'absolute bottom-3 left-3' : 'mt-3 w-fit'} flex py-1.5 px-3.5 ${mode === "light" ? "bg-white/80 text-black backdrop-blur-md" : "bg-[#1e293b]/80 text-white backdrop-blur-md"} rounded-3xl gap-2.5 shadow-md`}>
                        <div className={`flex items-center gap-1.5`}>
                            <HeartFill
                                className={`cursor-pointer text-lg ${heart ? "text-red-500" : ""}`}
                                onClick={handleReact}
                            />
                            <span>{reacts}</span>
                        </div>
                        <div className={`flex items-center gap-1.5`}>
                            <ChatDotsFill 
                                onClick={() => setSelectedComment(certificate?.id ? certificate?.id : '')}
                                className={`cursor-pointer text-lg`}
                            />
                            <span> {comments?.length} </span>    
                        </div>
                    </div>
                </div>
            ) : (
                <div className={`mt-3 flex w-fit py-1.5 px-3.5 ${mode === "light" ? "bg-gray-200 text-black" : "bg-[#1e293b] text-white"} rounded-3xl gap-2.5 shadow-sm`}>
                    <div className={`flex items-center gap-1.5`}>
                        <HeartFill
                            className={`cursor-pointer text-lg ${heart ? "text-red-500" : ""}`}
                            onClick={handleReact}
                        />
                        <span>{reacts}</span>
                    </div>
                    <div className={`flex items-center gap-1.5`}>
                        <ChatDotsFill 
                            onClick={() => setSelectedComment(certificate?.id ? certificate?.id : '')}
                            className={`cursor-pointer text-lg`}
                        />
                        <span> {comments?.length} </span>    
                    </div>
                </div>
            )}

            <div className="mt-4">
                <PostComment postId={certificate?.id ? certificate?.id : ""} />
                <CommentForm post={certificate} />
            </div>
            <Gallery id={certificate.id} images={certificate?.images ? certificate?.images : []} />
        </div>
    )
}