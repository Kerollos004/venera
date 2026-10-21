"use client"
import React from 'react';
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

interface ChartData {
    label: string;
    clientsCount: number;
}

export default function AdminProgress({ profiles }: { profiles: ProfileType[] }) {
    const { mode } = useThemeContext()
    const isLight = mode === "light";
    const safeProfiles = Array.isArray(profiles) ? profiles : [];

    // 1. قالب الشهور الأساسي بأصفار
    const monthsTemplate: ChartData[] = [
        { label: 'Jan', clientsCount: 0 },
        { label: 'Feb', clientsCount: 0 },
        { label: 'Mar', clientsCount: 0 },
        { label: 'Apr', clientsCount: 0 },
        { label: 'May', clientsCount: 0 },
        { label: 'Jun', clientsCount: 0 },
        { label: 'Jul', clientsCount: 0 },
        { label: 'Aug', clientsCount: 0 },
        { label: 'Sep', clientsCount: 0 },
        { label: 'Oct', clientsCount: 0 },
        { label: 'Nov', clientsCount: 0 },
        { label: 'Dec', clientsCount: 0 },
    ];

        safeProfiles.forEach(profile => {
        if (!profile?.created_at) return;
        const monthIndex = new Date(profile.created_at).getMonth(); // ترجع من 0 إلى 11
        if (monthsTemplate[monthIndex]) {
            monthsTemplate[monthIndex].clientsCount += 1;
        }
    });

    return (
        <div className={`h-[400px] w-full ${isLight ? "bg-gray-300 text-black" : "bg-[#1e293b] text-white"} rounded-3xl p-6 shadow-md flex flex-col`}>
            <h3 className='text-3xl text-blue-600 font-bold mb-4 capitalize'> Clients Progress </h3>
            
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={monthsTemplate}
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
                            allowDecimals={false} // عشان أرقام العملاء تكون صحيحة (أعداد صحيحة فقط)
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
                            dataKey="clientsCount"
                            name="New Clients"
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