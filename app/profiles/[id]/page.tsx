import Profile from '@/app/Components/profileviewcomponents/Profile';
import { supabase } from '@/app/Components/assets/supabase-client';
import { ProfileType } from '@/app/Components/assets/assets';

export default async function ProfilesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) {
        return
    }

    const { data: profileData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

    if (userError || !profileData || !id) {
        console.log("Error fetching user:", userError?.message);
        return (
            <main className='w-full min-h-screen px-3.5 md:px-10 pt-20 py-10'>
                <h3 className='text-center text-xl text-red-500'>Profile not found</h3>
            </main>
        );
    }

    const fetchUserPosts = async () => {
        const { data, error: postsError } = await supabase
            .from("posts")
            .select("*")
            .eq("user_id", profileData.id);
        if (postsError) console.log("Error fetching posts:", postsError.message);
        return data ;
    }

    const allposts = await fetchUserPosts() || []

    const cases = allposts?.filter(post => post?.type === "case");
    const certificates = allposts?.filter(post => post?.type === "certificate");
    const achievements = allposts?.filter(post => post?.type === "achievement");

    const fullProfile: ProfileType = {
        ...profileData,
        doctorPosts: cases, 
        doctorAchievements: achievements,
        doctorCertificates: certificates, 
    };

    return (
        <Profile profile={fullProfile} />
    );
}