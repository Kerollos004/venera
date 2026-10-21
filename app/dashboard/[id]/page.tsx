import DasboardPosts from '@/app/Components/dashoboardcomponents/DasboardPosts';
import DasboardStats from '@/app/Components/dashoboardcomponents/DasboardStats';
import DashboardAddPost from '@/app/Components/dashoboardcomponents/DashboardAddPost';
import DashboardProgress from '@/app/Components/dashoboardcomponents/DasboardProgress';
import { supabase } from '@/app/Components/assets/supabase-client';
import { ProfileType } from '@/app/Components/assets/assets';
import DashboardQRCode from '@/app/Components/dashoboardcomponents/DashboardQrCode';
import DashboardSettings from '@/app/Components/dashoboardcomponents/DashboardSettings';
import DashboardUpadateProfile from '@/app/Components/dashoboardcomponents/DashboardUpadateProfile';
export default async function Dashboard({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!id) {
        return 
    }
        const fetchUsersData = async () => {
            const { data, error } = await supabase.from("users").select("*").eq("id" , id).single()
            if (error || !id) {
                console.log("error in getting data", error?.message)
                return
            }
            if (data) {
                return data
            }
            
        }
    const profile = await fetchUsersData()


    const fetchUserPosts = async () => {
        const { data , error: postsError } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", profile.id);
        if (postsError) console.log("Error fetching posts:", postsError.message);
        return data
    }

    const allposts = await fetchUserPosts() || []




const fullProfile: ProfileType = {
        ...profile,
        doctorPosts: allposts, 
    };

    if (!profile) {
        return <main className='w-full min-h-screen  px-3.5 md:px-10 md:pt-20 py-10'><h3>not found</h3></main>
        
    }

const getPostComments = async () => {
        if (!allposts || allposts.length === 0) return [];
        
        const postIds = allposts.map(p => p.id);
        const { data, error } = await supabase
            .from("comments")
            .select("*")
            .in("post_id", postIds); 

        if (error) {
            console.log("error in getting comments", error.message);
            return [];
        }
        return data || [];
    };
    const postComments = await getPostComments()

    return (
        <main className=' w-full min-h-screen bg-fixed  overflow-x-hidden py-20  px-3.5 md:px-10'>
            <DasboardStats  comments={postComments?.length} profile={fullProfile} />
            <section className='grid grid-cols-1 mb-5  md:grid-cols-2 gap-3.5'>
                <DasboardPosts profile={fullProfile} />
                <DashboardProgress profile={fullProfile} />
            </section>
            <DashboardAddPost />
            <section className='grid grid-cols-1 mt-5 items-center  md:grid-cols-2 gap-3.5'>
                <DashboardQRCode profile={profile} />
                <DashboardSettings profile={profile} />
            </section>
            <DashboardUpadateProfile profile={profile} />
        </main>
    )
}    