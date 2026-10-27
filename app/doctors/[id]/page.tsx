import Profile from '@/app/Components/profileviewcomponents/Profile';
import { supabase } from '@/app/Components/assets/supabase-client';
import { ProfileType } from '@/app/Components/assets/assets';

export default async function ProfilesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) {
        return
    }

    const fetchDoctor = async () => {
        const { data } = await supabase.from("users")
            .select("*")
            .eq("id", id)
            .eq("doctorType", "dentist")
            .single()
        if (data) {
            return data
        }
    }

    const doctor = await fetchDoctor()





    const fetchUserPosts = async () => {
        const { data, error: postsError } = await supabase
            .from("posts")
            .select("*")
            .eq("user_id", doctor?.id);
        if (postsError) console.log("Error fetching posts:", postsError.message);
        return data ;
    }

    const allposts = await fetchUserPosts() || []

    const cases = allposts?.filter(post => post?.type === "case");
    const certificates = allposts?.filter(post => post?.type === "certificate");
    const achievements = allposts?.filter(post => post?.type === "achievement");

    const fullProfile: ProfileType = {
        ...doctor,
        doctorPosts: cases, 
        doctorAchievements: achievements,
        doctorCertificates: certificates, 
    };

    return (
        <Profile profile={fullProfile} />
    );
}