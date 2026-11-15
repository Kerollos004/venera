import React from 'react'
import type { Metadata } from "next";
import RegisterLayout from '../Components/registercomponents/RegisterLayout';
export const metadata: Metadata = {
  title: "Veneraup - فينيرا أب | نظام حجز وإدارة العيادات والمواعيد",
  description: "منصة فينيرا أب (Veneraup) المتكاملة لحجز المواعيد وإدارة العيادات والملفات الطبية بسهولة.",
  keywords: ["Veneraup", "فينيرا", "فينيرا أب", "حجز مواعيد", "إدارة عيادات"],
  alternates: {
    canonical: "https://veneraup.com",
  },
  openGraph: {
    title: "Veneraup - فينيرا أب | نظام حجز وإدارة العيادات",
    description: "منصة فينيرا أب المتكاملة للأطباء والمراكز لحجز المواعيد وإدارة العيادات.",
    url: "https://veneraup.com",
    siteName: "Veneraup - فينيرا أب",
    locale: "ar_EG",
    type: "website",
  },
};
export default function Login() {
    return (
        <main className='w-full min-h-screen bg-fixed flex items-center justify-center px-3.5 md:px-10 md:pt-20 py-10'>
            <RegisterLayout/>
        </main>
    )
}
