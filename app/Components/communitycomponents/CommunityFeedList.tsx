"use client"
import React, { useState, useEffect } from 'react';
import Post from './Post';
import "../../reacti18"
import { supabase } from '../assets/supabase-client';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CommunityFeedList({ initialPosts }: { initialPosts: any[] }) {
    const [posts, setPosts] = useState(initialPosts);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const POSTS_PER_PAGE: number = 10;
    const { t } = useTranslation();

    const fetchMorePosts = async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        // حساب الـ range بناءً على الصفحة الحالية بدقة
        const startIndex = page * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE - 1;

        const { data: newPosts, error } = await supabase
            .from("posts")
            .select("*")
            .order('created_at', { ascending: false })
            .range(startIndex, endIndex);

        if (error || !newPosts || newPosts.length === 0) {
            setHasMore(false);
            setLoading(false);
            return;
        }

        // جلب أصحاب البوستات الجديدة
        const userIds = [...new Set(newPosts.map(p => p.user_id))];
        const { data: newUsers } = await supabase
            .from("users")
            .select("*")
            .in('id', userIds);

        const usersList = newUsers || [];

        // دمج البوستات الجديدة بأصحابها
        const combinedNewPosts = newPosts.map((post) => {
            const matchedUser = usersList.find((user) => user.id === post.user_id);
            return {
                ...post,
                postOwner: matchedUser || {}
            };
        });

        setPosts((prev) => [...prev, ...combinedNewPosts]);
        setPage((prev) => prev + 1);
        setLoading(false);

        if (newPosts.length < POSTS_PER_PAGE) {
            setHasMore(false);
        }
    };

    // مراقبة النزول لآخر الصفحة لتفعيل الـ Infinite Scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 250) {
                fetchMorePosts();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore, page]);

    return (
        <>
            {posts.map((post) => (
                <Post 
                    key={post.id} 
                    post={post} 
                    profile={post.postOwner} 
                />
            ))}

            {loading && (
                <div className="flex flex-col items-center justify-center py-6 gap-3">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-sm font-medium animate-pulse">
                        {t('community.loaderText')}
                    </p>
                </div>
            )}

            {!hasMore && (
                <div className="text-center py-6 text-slate-500 text-sm font-medium">
                    {t('community.endPosts')}
                </div>
            )}
        </>
    );
}