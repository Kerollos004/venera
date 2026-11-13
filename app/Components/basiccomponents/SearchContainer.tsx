/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import React, { useState, useEffect } from 'react';
import { supabase } from '../assets/supabase-client';

import SearchResult from './SearchResult';
import { ProfileType } from '../assets/assets';
import { XCircleFill } from 'react-bootstrap-icons';
import { useOpenSearchDoctorsContext } from '../assets/contexts';

export default function SearchContainer() {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [allUsers, setAllUsers] = useState<ProfileType[]>([]);
    const [searchedUsers, setSearchedUsers] = useState<ProfileType[]>([]);
    const {setOpenSearchDoctors , openSearchDoctors } =  useOpenSearchDoctorsContext()
    
    const getUsers = async () => {
        const {  data } = await supabase.from("users").select("*")
        if (data) {
            setAllUsers(data)
        }
    }

    useEffect(() => {
        getUsers()
    }, [])

const handleSearch = (query: string) => {
        setSearchQuery(query);
        
        if (!query.trim()) {
            setSearchedUsers([]);
            return;
        }

        const filtered = allUsers.filter((user) => 
            user?.doctorName?.toLowerCase().includes(query.toLowerCase())
        );

        setSearchedUsers(filtered);
    };

    const searchUsersMap = searchedUsers.map(user => {
        return (
            <SearchResult profile={user} key={user?.id} />
        )
    })


    return (
        <section className={`  ${openSearchDoctors?"fixed":"hidden"} inset-0 z-70 flex flex-col items-center justify-start px-2.5 py-10 md:px-40 bg-black/60 backdrop-blur-sm animate-fadeIn`}>
            <input className='w-full p-3 text-white rounded-2xl border-2 mb-4 border-gray-200 focus:border-blue-600'
                type="text"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchQuery(e.target.value)
                    handleSearch(e.target.value)
                }}
            />

            {searchUsersMap}

            <XCircleFill onClick={() => {
                setOpenSearchDoctors(false)
            }} className=' mt-100 text-4xl hover:text-red-600 text-white'/>

        </section>
    );
}
