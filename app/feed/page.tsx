import type { Metadata } from "next";
import { supabase } from '../Components/assets/supabase-client';
import Post from '../Components/communitycomponents/Post';

// منع الكاش عشان التعديلات والأسماء تسمع فوراً
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
    title: "veneraup",
    description: "Venera SaaS app community page",
};

export default async function Feed() {
    // 1. جلب أحدث 20 بوست دفعة واحدة
    const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order('created_at', { ascending: false })
        .range(0, 19);
        
    if (postsError || !posts) {
        console.log("Error fetching posts:", postsError?.message);
        return (
            <main className='w-full min-h-screen grid grid-cols-1 gap-4 px-3.5 md:px-40 lg:px-80 md:pt-20 py-10 text-center text-slate-400'>
            </main>
        );
    }

    if (posts.length === 0) {
        return (
            <main className='w-full min-h-screen grid grid-cols-1 gap-4 px-3.5 md:px-40 lg:px-80 md:pt-20 py-10 text-center text-slate-400'>
            </main>
        );
    }

    // 2. جلب المستخدمين المرتبطين بالبوستات دي بـ Set واحدة لتجنب التكرار
    const userIds = [...new Set(posts.map(p => p.user_id))];
    
    const { data: users, error: usersError } = await supabase
        .from("users")
        .select("*")
        .in('id', userIds);

    const currentUsers = users || [];

    // 3. دمج البوست بصاحبه فوراً
    const combinedPosts = posts.map((post) => {
        const matchedUser = currentUsers.find((user) => user.id === post.user_id);
        return {
            ...post,
            postOwner: matchedUser || {}
        };
    });

    return (
        <main className='w-full min-h-screen bg-fixed grid grid-cols-1 gap-4 px-3.5 md:px-40 lg:px-80 md:pt-20 py-10'>
            {combinedPosts.map((post) => (
                <Post 
                    key={post.id} 
                    post={post} 
                    profile={post.postOwner} 
                />
            ))}
        </main>
    );
}