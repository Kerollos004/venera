/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { useState  , useEffect} from 'react'
import { HeartFill , ChatDotsFill } from 'react-bootstrap-icons'
import Image from 'next/image'
import {  postType } from '../assets/assets'
import { supabase } from '../assets/supabase-client'
import { useThemeContext , useSelectedCommentContext } from '../assets/contexts'
import CommentForm from '../comments/CommentForm'
import PostComment from '../comments/PostComment'
    import "../../reacti18"
import { useTranslation } from 'react-i18next'


export function SinglePostCase({currentCase  }:{currentCase:postType}) {
    const [heart, setHeart] = useState(false)
    const [reacts, setReacts] = useState<number>(currentCase?.likes ? currentCase.likes : 0)
    const [comments, setComments] = useState<number>(0)

    const [more, setMore] = useState<boolean>(false)
    const limit = 150
    const { mode } = useThemeContext()
    const { setSelectedComment } = useSelectedCommentContext()
    const { t } = useTranslation()
    

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
    } , [])

    const handleAddLikeOwner = async () => {
        const { data: owner, error: authErr } = await supabase.auth.getUser()
        if (authErr) {
            console.log("error in getting user", authErr.message)
            return;
        }
        const ownerId = owner?.user?.id
        const oldLovers: string[] = currentCase?.post_likers ? currentCase?.post_likers : []
        const updatedLovers: string[] = [...oldLovers , ownerId]
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
            .eq("id", currentCase?.id);
            
        if (error) {
            console.log("error in adding like", error.message);
        }
    }
    return (
<article>
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

    {currentCase?.image ? (
        <div className="relative mt-3 overflow-hidden rounded-xl">
            <Image
                onDoubleClick={handleDoubleReact}
                src={currentCase.image}
                alt='case image'
                width={400}
                height={400}
                draggable={false}
                className='w-full h-82 object-cover pointer-events-none'
                loading='lazy'
            />
            <div className={`absolute bottom-4 left-4 flex py-2 px-4 ${mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"} rounded-3xl gap-2.5 shadow-md z-10`}>
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
        <div className={`mt-3 flex w-fit py-2 px-4 ${mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"} rounded-3xl gap-2.5 shadow-sm`}>
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
</article>
    )
}