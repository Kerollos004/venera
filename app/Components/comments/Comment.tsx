
/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { useThemeContext } from '../assets/contexts'
import Image from 'next/image'
import img from "../../../public/images/doc-removebg-preview.png"
import { HeartFill } from 'react-bootstrap-icons'
import { CommentType, ProfileType } from '../assets/assets'
import { supabase } from '../assets/supabase-client'
import { useEffect, useState } from 'react'

export default function Comment({ comment }: { comment: CommentType }) {
    const [commentOwner, setCommentOwner] = useState<ProfileType | null>(null)
    const [heart, setHeart] = useState<boolean>(false)
    const [reacts, setReacts] = useState<number>(comment?.comment_likes ? comment?.comment_likes : 0)
    const [loading, setLoading] = useState<boolean>(true) 
    const { mode } = useThemeContext()

    useEffect(() => {
        const fetchCommentData = async () => {
            setLoading(true);
            
            const { data: ownerData, error: ownerError } = await supabase
                .from("users")
                .select("*")
                .eq("id", comment?.owner_id)
                .single();

            if (ownerError) {
                console.log("error in getting comment owner", ownerError.message);
            } else if (ownerData) {
                setCommentOwner(ownerData);
            }

            const { data: authUser, error: authErr } = await supabase.auth.getUser();
            if (!authErr && authUser?.user?.id) {
                const userId = authUser.user.id;
                const oldLikers: string[] = comment?.comment_likers ? comment?.comment_likers : [];
                if (oldLikers.includes(userId)) {
                    setHeart(true);
                } else {
                    setHeart(false);
                }
            }

            setLoading(false); 
        };

        fetchCommentData();
    }, [comment]);

    const handleAddLikeOwner = async () => {
        const { data: owner, error: authErr } = await supabase.auth.getUser()
        if (authErr) {
            console.log("error in getting user", authErr.message)
            return;
        }
        const ownerId = owner?.user?.id
        const oldCommentLovers: string[] = comment?.comment_likers ? comment?.comment_likers : []
        const updatedLovers: string[] = [...oldCommentLovers, ownerId]
        
        if (!heart) {
            await supabase.from("comments").update({ comment_likers: updatedLovers }).eq("id", comment?.id)
        } else {
            const updatedLoverDelete = updatedLovers.filter(id => id !== ownerId)
            await supabase.from("comments").update({ comment_likers: updatedLoverDelete }).eq("id", comment?.id)
        }
    }

    const handleReact = async () => {
        setHeart(!heart)
        const newCount = !heart ? reacts + 1 : reacts - 1
        setReacts(newCount);
        await addCommentsToDb(newCount);
        await handleAddLikeOwner()
    }

    const addCommentsToDb = async (count: number) => {
        const { error } = await supabase
            .from("comments")
            .update({ comment_likes: count })
            .eq("id", comment?.id);
            
        if (error) {
            console.log("error in adding like", error.message);
        }
    }

    return (
        <article className={`${mode === "light" ? "bg-gray-400 text-black" : "bg-gray-900 text-white"} flex mb-2 justify-between items-center p-3 px-3.5 rounded-3xl`}>
            <div className="flex items-start gap-2.5 w-full">
                
                {/* لو البيانات لسه بتحمل، بنعرض شكل Skeleton خفيف عشان ميبحصلش قفزة في الشاشة */}
                {loading ? (
                    <div className="flex items-center gap-3 w-full animate-pulse">
                        <div className="w-16 h-16 bg-gray-600 rounded-full shrink-0" />
                        <div className="flex flex-col gap-2 w-full">
                            <div className="h-5 bg-gray-600 rounded w-1/3" />
                            <div className="h-4 bg-gray-600 rounded w-2/3" />
                        </div>
                    </div>
                ) : (
                    <>
                        <Image
                            src={commentOwner?.doctorImage ? commentOwner?.doctorImage : img}
                            alt='img'
                            width={200}
                            height={200}
                            loading='lazy'
                            className='w-16 h-16 border-4 border-blue-600 rounded-full object-cover shrink-0'
                        />
                        <div className="w-full">
                            <h2 className='text-2xl mb-1 text-blue-600 font-bold'> {commentOwner?.doctorName || "User"} </h2>
                            <p className='text-[18px] break-word'> {comment?.comment_text} </p>
                        </div>
                    </>
                )}
            </div>

            <div className="flex items-center gap-2 ">
                <HeartFill 
                    onClick={async () => {
                        await handleReact()
                    }} 
                    className={`text-2xl  ${heart ? "text-red-600" : "text-white"}`} 
                />
                <span className="font-semibold"> {reacts} </span>
            </div>
        </article>
    )
}