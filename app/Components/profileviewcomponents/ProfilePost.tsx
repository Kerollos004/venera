
"use client"
import { ProfileType } from '../assets/assets'
import { SinglePostCase } from './singlePostCase'
import subImg from "../../../public/images/doc-removebg-preview.png"
import Image from 'next/image'
import { useThemeContext } from '../assets/contexts'


export default function ProfilePost({ profile }: { profile: ProfileType }) {
    const {mode} = useThemeContext()
    const postsMap = profile?.doctorPosts?.map(currentCase => {
        return (
            <article className={`${mode==="light"?"bg-white":"bg-[#102034]"} p-3  rounded-2xl mb-5`}  key={currentCase?.id}>
            <article className='flex mb-3 items-center gap-2.5'>
                <Image
                    src={profile.doctorImage?profile.doctorImage:subImg}
                    alt='img'
                    width={130}
                    height={130}
                    className='rounded-full  border-2  w-20 h-20 border-blue-500'
                    loading='lazy'
                />
                <article>
                    <h3 className='md:text-4xl text-2xl text-blue-500 mb-1 font-bold'>{profile.doctorName}</h3>
                    {
                        profile.doctorTitle?<p className=' text-left'>{profile.doctorTitle}</p>:""
                    }
                </article>
            </article>
            <SinglePostCase currentCase={currentCase} />
            </article>
        )
    })


    return (
        <>
        <article key={profile.id}  >
            {postsMap}
        </article>
        </>
    )
}

