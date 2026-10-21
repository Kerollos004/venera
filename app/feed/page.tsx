

import type { Metadata } from "next";
import { supabase } from '../Components/assets/supabase-client';
import CommunityFeedList from "../Components/communitycomponents/CommunityFeedList";
export const metadata: Metadata = {
    title: "Community",
    description: "Venera SaaS app community page",
};

export default async function Feed() {
    // 1. بنجيب أول 10 بوستات فقط بالأحدث (من 0 إلى 9) عشان السرعة
    const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .range(0, 9);
        
    if (postsError || !posts) {
        console.log("Error fetching posts:", postsError?.message);
        return
    }

    const currentPosts = posts || [];

    // 2. بنجيب المستخدمين بتوع الـ 10 بوستات دول بس (أو نجيبهم كلهم لو العدد صغير، بس الأفضل كدة)
    const userIds = [...new Set(currentPosts.map(p => p.user_id))];

    if (!userIds) {
        return
    }
    
    const { data: users, error: usersError } = await supabase
        .from("users")
        .select("*")
        .in('id', userIds); // بنجيب أصحاب الـ 10 بوستات دول بس لتوفير الوقت والداتا!

    if (usersError || !users) {
        console.log("Error fetching users:", usersError?.message);
        return
    }

    const currentUsers = users || [];

    // 3. دمج البوستات بصاحبها
    const combinedPosts = currentPosts.map((post) => {
        const matchedUser = currentUsers.find((user) => user.id === post.user_id);
        return {
            ...post,
            postOwner: matchedUser || {}
        };
    });

    return (
        <main className='w-full min-h-screen bg-fixed grid grid-cols-1 gap-4 px-3.5 md:px-40 lg:px-80 md:pt-20 py-10'>
            <CommunityFeedList initialPosts={combinedPosts} />
        </main>
    );
}