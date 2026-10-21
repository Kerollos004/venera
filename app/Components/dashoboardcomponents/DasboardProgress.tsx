
/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import React, { useEffect, useState } from 'react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import { useThemeContext } from '../assets/contexts';
import { ProfileType } from '../assets/assets';
import { supabase } from '../assets/supabase-client';

interface ChartData {
    label: string;
    count: number;
}

export default function AdminProgress({ profile }: { profile: ProfileType }) {
    const { mode } = useThemeContext()
    const isLight = mode === "light";

    const [monthsData, setMonthsData] = useState<ChartData[]>([
        { label: 'Jan', count: 0 },
        { label: 'Feb', count: 0 },
        { label: 'Mar', count: 0 },
        { label: 'Apr', count: 0 },
        { label: 'May', count: 0 },
        { label: 'Jun', count: 0 },
        { label: 'Jul', count: 0 },
        { label: 'Aug', count: 0 },
        { label: 'Sep', count: 0 },
        { label: 'Oct', count: 0 },
        { label: 'Nov', count: 0 },
        { label: 'Dec', count: 0 },
    ]);

    const getMonthProgress = async () => {
        if (!profile?.id) return;

        const tempMonths: ChartData[] = [
            { label: 'Jan', count: 0 },
            { label: 'Feb', count: 0 },
            { label: 'Mar', count: 0 },
            { label: 'Apr', count: 0 },
            { label: 'May', count: 0 },
            { label: 'Jun', count: 0 },
            { label: 'Jul', count: 0 },
            { label: 'Aug', count: 0 },
            { label: 'Sep', count: 0 },
            { label: 'Oct', count: 0 },
            { label: 'Nov', count: 0 },
            { label: 'Dec', count: 0 },
        ];

            // 1. جلب البوستات والتأكد من وجود تاريخ (لو مفيش تاريخ بنعتبره شهر الحالية أو نتخطاه بأمان)
        const { data: profilePosts  , error:likeError} = await supabase
            .from("posts")
            .select("likes, created_at")
            .eq("user_id", profile.id);
        if (likeError) {
            console.log("error in getting like" , likeError.message)
        }
        if (profilePosts) {
            profilePosts.forEach(post => {
                // لو البوست ليه تاريخ، نوزعه على شهره، لو مفيش بنحطه في أول شهر كمثال أو نتخطاه
                const postDate = post.created_at ? new Date(post.created_at) : new Date();
                const monthIndex = postDate.getMonth(); 
                const postLikes = post.likes ?? 0;

                if (tempMonths[monthIndex]) {
                    tempMonths[monthIndex].count += postLikes;
                }
            });
        }

        // 2. جلب التعليقات (لو الجدول فيه created_at بنستخدمه، لو مش بيحتويه بنعدهم كإجمالي)
        const { data: commentsData , error:commentError } = await supabase
            .from("comments")
            .select("created_at")
            .eq("owner_id", profile.id);
        
        if (commentError) {
            console.log("error in getting like" , commentError.message)
        }

        if (commentsData) {
            commentsData.forEach(comment => {
                const commentDate = comment.created_at ? new Date(comment.created_at) : new Date();
                const monthIndex = commentDate.getMonth(); 
                if (tempMonths[monthIndex]) {
                    tempMonths[monthIndex].count += 1;
                }
            });
        }

        setMonthsData(tempMonths);
    };

    useEffect(() => {
        getMonthProgress();
    }, []);

    return (
        <div className={`h-[400px] w-full ${isLight ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"} rounded-3xl p-6 shadow-md flex flex-col`}>
            <h3 className='text-3xl text-blue-600 font-bold mb-4 capitalize'> likes and comments </h3>
            
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={monthsData}
                        margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
                    >
                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke={isLight ? "#cbd5e1" : "#334155"} 
                            opacity={0.6} 
                        />
                        <XAxis 
                            dataKey="label" 
                            stroke={isLight ? "#475569" : "#94a3b8"} 
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                            stroke={isLight ? "#475569" : "#94a3b8"} 
                            tick={{ fontSize: 12 }}
                            allowDecimals={false}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: isLight ? "#ffffff" : "#0f172a", 
                                borderColor: isLight ? "#cbd5e1" : "#334155",
                                borderRadius: "12px",
                                color: isLight ? "#000" : "#fff"
                            }} 
                        />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                        <Line
                            type="monotone"
                            dataKey="count"
                            name="likes and comments"
                            stroke="#2563eb" 
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#2563eb" }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}