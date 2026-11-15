/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { useState, useEffect } from 'react'
import { HeartFill, ChatDotsFill } from 'react-bootstrap-icons'
import Image from 'next/image'
import { postType } from '../assets/assets'
import { supabase } from '../assets/supabase-client'
import { useThemeContext, useSelectedCommentContext, useOpenGalleryContext , useSelectedPostContext} from '../assets/contexts'
import CommentForm from '../comments/CommentForm'
import PostComment from '../comments/PostComment'
import "../../reacti18"
import { useTranslation } from 'react-i18next'
import Gallery from '../basiccomponents/Gallery'

export function SinglePostCase({ currentCase }: { currentCase: postType }) {
    const [heart, setHeart] = useState(false)
    const [reacts, setReacts] = useState<number>(currentCase?.likes ? currentCase.likes : 0)
    const [comments, setComments] = useState<number>(0)
    const [more, setMore] = useState<boolean>(false)

    const limit = 150
    const { mode } = useThemeContext()
    const { setSelectedComment } = useSelectedCommentContext()
    const { t } = useTranslation()
    const { setOpenGallery } = useOpenGalleryContext()
    const { setSelectedPost } = useSelectedPostContext()
    

    // تجميع الصور (دعم القديم والجديد معاً)
    const caseImages: string[] = currentCase?.images && currentCase.images.length > 0 
        ? currentCase.images 
        : (currentCase as any)?.image ? [(currentCase as any).image] : [];

    const checkUserLikeStatus = async () => {
        const { data: owner, error: authErr } = await supabase.auth.getUser()
        if (authErr) {
            console.log("error in getting user", authErr.message)
            return;
        }

        const userId = owner?.user?.id;
        if (userId) {
            const oldLikers: string[] = currentCase?.post_likers || [];
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

    const handleDisplayPostComments = async () => {
        const { data, error } = await supabase
            .from("comments")
            .select("*")
            .eq("post_id", currentCase?.id)    

        if (error) {
            console.log("error in getting post comments", error.message);
        }
        if (data) {
            setComments(data?.length);
        }
    }

    useEffect(() => {
        handleDisplayPostComments()
    }, [])

    const handleAddLikeOwner = async () => {
        const { data: owner, error: authErr } = await supabase.auth.getUser()
        if (authErr) {
            console.log("error in getting user", authErr.message)
            return;
        }
        const ownerId = owner?.user?.id
        const oldLovers: string[] = currentCase?.post_likers ? currentCase?.post_likers : []
        const updatedLovers: string[] = [...oldLovers, ownerId]
        if (!heart) {
            const { error: updateErr } = await supabase.from("posts").update({ post_likers: updatedLovers }).eq("id", currentCase?.id)
            if (updateErr) {
                console.log("error in adding like owner", updateErr.message);
            }
        } else {
            const updatedLoverDelete = updatedLovers.filter(id => id !== ownerId)
            if (updatedLoverDelete) {
                const { error: updateErr } = await supabase.from("posts").update({ post_likers: updatedLoverDelete }).eq("id", currentCase?.id)
                if (updateErr) {
                    console.log("error in removing like owner", updateErr.message);
                }
            }
        }
    }

    const handleReact = async () => {
        setHeart(!heart);
        const newCount = !heart ? reacts + 1 : reacts - 1 
        setReacts(newCount);
        await addLikesToDb(newCount);
        await handleAddLikeOwner()
    }

    const handleDoubleReact = async () => {
        if (heart) return; 
        setHeart(true);
        const newCount = reacts + 1;
        setReacts(newCount);
        await addLikesToDb(newCount);
        await handleAddLikeOwner()
    }

    const addLikesToDb = async (count: number) => {
        const { error } = await supabase
            .from("posts")
            .update({ likes: count })
            .eq("id", currentCase?.id);
            
        if (error) {
            console.log("error in adding like", error.message);
        }
    }

    // منطق العرض للصور (عرض أول صورتين لو أكتر من 2، والكارت التالت جنبهم)
    const hasMoreImages = caseImages.length > 3;
    const displayedImages = hasMoreImages ? caseImages.slice(0, 2) : caseImages;
    const extraImagesCount = caseImages.length - 2;

    return (
        <article className="p-3 mb-4">
            <div className="px-1">
                <h3 className='mb-2 text-xl font-semibold'> {currentCase.name} </h3>
                {currentCase?.description ? (
                    <p>
                        {more ? currentCase.description : `${currentCase.description?.substring(0, limit)}`}
                        {currentCase.description?.length > limit && (
                            <span
                                onClick={() => setMore(!more)}
                                className="text-blue-600 cursor-pointer font-bold ml-2 hover:underline"
                            >
                                {more ? t("community.seeLess") : t("community.seeMore")}
                            </span>
                        )}
                    </p>
                ) : ""}
            </div>

            {/* عرض الصور المتعددة بالشكل الجديد (كارت عرض المزيد جنبه في الشبكة بدون مودال) */}
            {caseImages.length > 0 ? (
                <div className="relative mt-3">
                    <div className={`grid gap-2 rounded-xl overflow-hidden ${
                        caseImages.length === 1 ? 'grid-cols-1' :
                        caseImages.length === 2 ? 'grid-cols-2' :
                        'grid-cols-2'
                    }`}>
                        {displayedImages.map((imgUrl, index) => (
                            <div 
                                key={index} 
                                className={`relative w-full overflow-hidden bg-slate-800 rounded-lg ${
                                    caseImages.length === 1 ? 'h-96' : 'h-48'
                                }`}
                            >
                                <Image
                                    onDoubleClick={handleDoubleReact}
                                    src={imgUrl}
                                    alt={`case image ${index}`}
                                    fill
                                    draggable={false}
                                    className='cursor-pointer object-cover hover:scale-105 transition duration-300'
                                    loading='lazy'
                                />
                            </div>
                        ))}

                        {/* كارت عرض المزيد الـ +N */}
                        {hasMoreImages && (
                            <div 
                                onClick={() => {
                                    setOpenGallery(true)
                                    setSelectedPost(currentCase?.id ? currentCase?.id:"")
                                }}
                                className="relative w-full h-48 overflow-hidden rounded-lg bg-slate-900 border-2 border-slate-700 cursor-pointer flex flex-col items-center justify-center text-white transition hover:border-blue-500 group"
                            >
                                <div className="absolute inset-0 opacity-20">
                                    <Image
                                        src={caseImages[2]}
                                        alt="extra background"
                                        fill
                                        className="object-cover group-hover:scale-105 "
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
                    
                    {/* أزرار التفاعل (اللايك والكومنت) */}
                    <div className={`mt-3 flex w-fit py-2 px-4 ${mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"} rounded-3xl gap-2.5 shadow-md`}>
                        <div className={`flex items-center gap-1.5`}>
                            <HeartFill
                                className={`cursor-pointer ${heart ? "text-red-500" : ""}`}
                                onClick={handleReact}
                            />
                            <span className=""> {reacts} </span>
                        </div>
                        <div className={`flex items-center gap-1.5`}>
                            <ChatDotsFill
                                onClick={() => {
                                    setSelectedComment(currentCase?.id ? currentCase?.id : "")
                                }}
                                className={`cursor-pointer`}
                            />
                            <span className=""> {comments} </span>
                        </div>
                    </div>
                </div>
            ) : (
                /* لو مفيش صور خالص، تظهر أزرار التفاعل تحت الوصف مباشرة */
                <div className={`mt-3 flex w-fit py-2 px-4 ${mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b]/80 text-white"} rounded-3xl gap-2.5 shadow-sm`}>
                    <div className={`flex items-center gap-1.5`}>
                        <HeartFill
                            className={`cursor-pointer ${heart ? "text-red-500" : ""}`}
                            onClick={handleReact}
                        />
                        <span className=""> {reacts} </span>
                    </div>
                    <div className={`flex items-center gap-1.5`}>
                        <ChatDotsFill
                            onClick={() => {
                                setSelectedComment(currentCase?.id ? currentCase?.id : "")
                            }}
                            className={`cursor-pointer`}
                        />
                        <span className=""> {comments} </span>
                    </div>
                </div>
            )}

            <PostComment postId={currentCase?.id ? currentCase?.id : ""} />
            <CommentForm post={currentCase} />
            <Gallery id={currentCase?.id} images={currentCase?.images? currentCase?.images : []} />
        </article>
    )
}