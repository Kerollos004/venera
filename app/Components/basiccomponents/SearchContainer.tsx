"use client"
import React, { useState, useEffect } from 'react';
import { supabase } from '../assets/supabase-client';
import Image from 'next/image';
import Link from 'next/link';
import subImg from "../../../public/images/doc-removebg-preview.png";
import { ProfileType } from '../assets/assets';

export default function SearchContainer() {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [allUsers , setAllUsers] = useState<ProfileType[]>([]);
    const [doctors, setDoctors] = useState<ProfileType[]>([]);



    return (
        <section className="fixed inset-0 z-90 flex flex-col items-center justify-start px-2.5 py-10 md:px-40 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <input className='w-full p-3 text-white rounded-2xl border-2 mb-4 border-gray-200 focus:border-blue-600'
                type="text"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchQuery(e.target.value)
                }}
            />
        </section>
    );
}
