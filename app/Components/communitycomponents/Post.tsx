
//loading added
"use client"

import { postType, ProfileType } from '../assets/assets'
import { useThemeContext } from '../assets/contexts'
import PostContent from './PostContent'
import PostHeader from './PostHeader'
import PostComment from '../comments/PostComment'
import CommentForm from '../comments/CommentForm'

export default function Post({ post, profile, loading = false }: { post?: postType, profile?: ProfileType, loading?: boolean }) {
    const { mode } = useThemeContext()

    if (loading) {
        return (
            <article className={`${mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"} p-4 relative overflow-hidden border-blue-500/40 border-t-6 rounded-2xl animate-pulse mb-4`}>
                {/* Header Skeleton */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-500/30 rounded-full shrink-0" />
                    <div className="flex flex-col gap-2 w-1/3">
                        <div className="h-4 bg-gray-500/30 rounded w-full" />
                        <div className="h-3 bg-gray-500/20 rounded w-2/3" />
                    </div>
                </div>
                {/* Content Skeleton */}
                <div className="flex flex-col gap-2 mt-4">
                    <div className="h-4 bg-gray-500/30 rounded w-full" />
                    <div className="h-4 bg-gray-500/30 rounded w-5/6" />
                    <div className="h-48 bg-gray-500/20 rounded-xl w-full mt-2" />
                </div>
            </article>
        )
    }

    return (
        <article className={`${mode === "light" ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"} p-3 h-fit  relative overflow-hidden border-blue-500 border-t-6 rounded-2xl mb-4 shadow-md`}>
            <PostHeader profile={profile!} />
            <PostContent post={post!} />
            <CommentForm post={post!} />
            <PostComment  postId={post?.id ? post?.id:''} />
        </article>
    )
}