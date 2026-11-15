import React from 'react'
import type { Metadata } from "next";
import Plans from '../Components/planscomponents/Plans';
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
export default function Pricing() {
    return (
        <main>
            <Plans/>
        </main>
    )
}

