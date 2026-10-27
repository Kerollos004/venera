
import { supabase } from "@/app/Components/assets/supabase-client"
import VisitorData from "@/app/Components/profileviewcomponents/VisitorData"
export default async function Dashboard({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    if (!id) {
        return
    }
    const fetchVisitorData = async () => {
        const { data , error } = await supabase.from("users")
            .select("*").eq("id", id).single()
        if (error) {
            console.log("error in getting user" , error.message)
        }
        return data
    }
    const visitor = await fetchVisitorData()
    return (
        <main className=' w-full min-h-screen bg-fixed  overflow-x-hidden py-20  px-3.5 md:px-10'>
            <VisitorData visitor={visitor}/>
        </main>
    )
}