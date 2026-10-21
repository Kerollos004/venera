/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import React, { useEffect }  from 'react'
import { useState } from 'react'
import { HeartFill , ChatDotsFill } from 'react-bootstrap-icons'
import {  useSelectedCommentContext, useThemeContext } from '../assets/contexts'
// import PostComment from '../comments/PostComment'
// import CommentForm from '../comments/CommentForm'
import "../../reacti18"
import { postType  } from '../assets/assets'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import { supabase } from '../assets/supabase-client'
export default function PostContent({post}:{post:postType}) {
    const [heart, setHeart] = useState(false)
    const [reacts, setReacts] = useState<number>(post.likes ? post?.likes : 0)
    const [comments, setComments] = useState<number>(0)
    const [more , setMore] = useState<boolean>(false)
    const { mode } = useThemeContext()
    const {setSelectedComment} = useSelectedCommentContext()
    const limit = 150;
    const { t } = useTranslation()

const checkUserLikeStatus = async () => {
        const { data: owner, error: authErr } = await supabase.auth.getUser()
        if (authErr || !owner.user) {
            console.log("error in getting user", authErr?.message)
            return;
        }

        const userId = owner?.user?.id;
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
    }, [])

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

    const handleAddLikeOwner = async () => {
        const { data: owner, error: authErr } = await supabase.auth.getUser()
        if (authErr || !owner.user) {
            console.log("error in getting user", authErr?.message)
            return;
        }
        const ownerId = owner?.user?.id
        const oldLovers: string[] = post?.post_likers ? post?.post_likers : []
        const updatedLovers: string[] = [...oldLovers , ownerId]
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


    const handleReact = async () => {
        setHeart(!heart);
        const newCount = !heart ? reacts + 1  :reacts - 1   
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
            .eq("id", post?.id);
            
        if (error) {
            console.log("error in adding like", error.message);
        }
    }
    return (
        // <div className=''>
        //     <div className="">
        //             <h3 className='mb-2.5 text-3xl'> {post.name} </h3>
        //             <p className="mb-2.5">
        //                 {more ? post.description : `${post.description?.substring(0, limit)}`}
                        
        //                 {(post.description?.length ?? 0) > limit && (
        //                     <span 
        //                         onClick={() => setMore(!more)} 
        //                         className="text-blue-500 cursor-pointer font-bold ml-2 hover:underline"
        //                     >
        //                         {more ? t("community.seeLess") :t("community.seeMore") }
        //                     </span>
        //                 )}
        //         </p>
                
        //     </div>
        //     <div className="relative mt-2.5 "> 
        //         {
        //             post?.image ? 
        //             <Image
        //             onDoubleClick={handleDoubleReact}
        //             src={post.image?post.image:""}
        //             alt='case image'
        //             width={400}
        //             height={400}
        //             draggable={false}
        //             className='w-full h-82 object-cover pointer-events-none '
        //             loading='lazy'
        //             />:""
        //         }
        //             <div className={`absolute   bottom-4 left-4 flex   py-2 px-4  ${mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"} rounded-3xl gap-2.5`}>
        //                 <div className={`  flex items-center gap-1.5  `}>
        //                     <HeartFill
        //                         className={`cursor-pointer  ${heart ? "text-red-500" : ""}`}
        //                     onClick={async () => {
        //                             await handleReact()
        //                         }}
        //                     />
        //                     <span className=""> {reacts} </span>
        //                 </div>
        //                 <div className={`  flex items-center gap-1.5  `}>
        //                 <ChatDotsFill 
        //                     onClick={() => {
        //                         setSelectedComment(post?.id ? post?.id:'')
        //                     }}
        //                         className={`cursor-pointer  `}
        //                     />
        //                     <span className=""> {comments } </span>
        //                 </div>
        //             </div>
        //         </div>
        // </div>
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
                className='w-full h-82 object-cover pointer-events-none rounded-xl'
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
