import React from 'react'
import type { Metadata } from "next";
import Plans from '../Components/planscomponents/Plans';
export const metadata: Metadata = {
    title: "veneraup",
    description: "venera saas app pricing page",
};
export default function Pricing() {
    return (
        <main>
            <Plans/>
        </main>
    )
}

