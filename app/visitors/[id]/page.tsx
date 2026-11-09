
import { supabase } from "@/app/Components/assets/supabase-client"
import VisitorData from "@/app/Components/profileviewcomponents/VisitorData"
export default async function Visitor({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    if (!id) {
        return
    }

    




    const fetchVisitorData = async () => {
        const { data , error } = await supabase.from("users")
        .select("*")
            .eq("id", id)
            .maybeSingle()
        if (error || !data) {
            console.log("error in getting user" , error?.message)
        }
        if (data) {
            return data
        }
    }




    const visitor = await fetchVisitorData()

    const fetchVisitorFeedBacks = async () => {
        const { error, data } = await supabase.from("feedbacks").select("*").eq("feedback_owner", visitor?.id).order("created_at", { ascending: false });
        if (error || !data) {
            console.log("error in getting feedbacks", error?.message)
            return
        }
        if(data){return data}
    }
    const feedBacks = await fetchVisitorFeedBacks() || []
    return (
        <main className=' w-full min-h-screen bg-fixed  overflow-x-hidden py-20  px-3.5 md:px-10'>
            <VisitorData feedBacks={feedBacks} visitor={visitor}/>
        </main>
    )
}

