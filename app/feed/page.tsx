import type { Metadata } from "next";
import { supabase } from '../Components/assets/supabase-client';
import CommunityFeedList from "../Components/communitycomponents/CommunityFeedList";

export const metadata: Metadata = {
    title: "Community",
    description: "Venera SaaS app community page",
};

export default async function Feed() {
    // 1. جلب أول 10 بوستات مرتبة بالأحدث صراحة
    const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order('created_at', { ascending: false })
        .range(0, 9);
        
    if (postsError || !posts) {
        console.log("Error fetching posts:", postsError?.message);
        return null;
    }

    const currentPosts = posts || [];

    if (currentPosts.length === 0) {
        return (
            <main className='w-full min-h-screen bg-fixed grid grid-cols-1 gap-4 px-3.5 md:px-40 lg:px-80 md:pt-20 py-10'>
                <CommunityFeedList initialPosts={[]} />
            </main>
        );
    }

    // 2. جلب المستخدمين المرتبطين بالبوستات دي فقط
    const userIds = [...new Set(currentPosts.map(p => p.user_id))];
    
    const { data: users, error: usersError } = await supabase
        .from("users")
        .select("*")
        .in('id', userIds);

    if (usersError || !users) {
        console.log("Error fetching users:", usersError?.message);
        return null;
    }

    const currentUsers = users || [];

    // 3. دمج كل بوست بصاحب البروفایل بتاعه
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