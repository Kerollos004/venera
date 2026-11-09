import Profile from '@/app/Components/profileviewcomponents/Profile';
import { supabase } from '@/app/Components/assets/supabase-client';
import { ProfileType } from '@/app/Components/assets/assets';

export default async function ProfilesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) {
        return
    }

    const getSession = async () => {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (!session || error) {
            console.log("error in getting session" , error?.message)
        }
    }

    await getSession()

    const fetchDoctors = async () => {
        const { data , error} = await supabase.from("users")
            .select("*")
            .eq("id", id)
            .eq("doctorType", "dentist")
            .maybeSingle()
        if (data) {
            return data
        }
        else {
            console.log("error in getting data  " , error?.message)
            return
        }
    }

    const doctor = await fetchDoctors()





    const fetchUserPosts = async () => {
        const { data, error: postsError } = await supabase
            .from("posts")
            .select("*")
            .eq("user_id", doctor?.id)
            .order("created_at", { ascending: false });
        if (postsError) console.log("Error fetching posts:", postsError.message);
        return data ;
    }

    const allposts = await fetchUserPosts() || [] 
    
    const fetchUserFeedbacks = async () => {
        const { data, error: postsError } = await supabase
            .from("feedbacks")
            .select("*")
            .eq("feedback_doctor", doctor?.id);
        if (postsError) console.log("Error fetching posts:", postsError.message);
        return data ;
    }
    const feedbacks = await fetchUserFeedbacks() || []

    const cases = allposts?.filter(post => post?.type === "case");
    const certificates = allposts?.filter(post => post?.type === "certificate");
    const achievements = allposts?.filter(post => post?.type === "achievement");

    const fullProfile: ProfileType = {
        ...doctor,
        doctorPosts: cases, 
        doctorAchievements: achievements,
        doctorCertificates: certificates, 
        doctorFeedbacks : feedbacks
    };

    return (
        <Profile profile={fullProfile} />
    );
}