"use client"
import { HeartFill , ChatDotsFill , PostcardFill } from 'react-bootstrap-icons'
import { useThemeContext } from '../assets/contexts'
import "../../reacti18"
import { useTranslation } from 'react-i18next'
import { CommentType, ProfileType } from '../assets/assets'
export default function DasboardStats({ profile , comments }: {profile:ProfileType , comments:number}) {
    const { mode } = useThemeContext()
    const { t } = useTranslation()
    const profileLikes = profile?.doctorPosts?.reduce((acc , curr) => acc + Number(curr?.likes) , 0)
    return (
        <section className={`grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-3.5   `}>
            
            <article className={` p-3 rounded-3xl  ${mode==="light"?"bg-gray-300 text-black" : "text-white bg-[#1e293b]"} `}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className=' capitalize text-2xl'> {t('dashboard.allPosts')} </h3>
                    <PostcardFill className='text-2xl' />
                </div>
                <span className='text-3xl text-blue-600'> {profile?.doctorPosts?.length} </span>
            </article>

            <article className={` p-3 rounded-3xl  ${mode==="light"?"bg-gray-300 text-black" : "text-white bg-[#1e293b]"} `}>
                <div className="flex  justify-between items-center mb-2">
                    <h3 className=' capitalize text-2xl'> {t('dashboard.allLikes')} </h3>
                    <HeartFill className='text-2xl' />
                </div>
                <span className='text-3xl text-blue-600'> {profileLikes} </span>
            </article>

            <article className={` p-3 rounded-3xl  ${mode==="light"?"bg-gray-300 text-black" : "text-white bg-[#1e293b]"} `}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className=' capitalize text-2xl'> {t('dashboard.allComments')} </h3>
                    <ChatDotsFill className='text-2xl' />
                </div>
                <span className='text-3xl text-blue-600'> {comments} </span>
            </article>
        </section>
    )
}
