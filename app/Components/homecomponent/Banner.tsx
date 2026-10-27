"use client"
import React from 'react'
import { motion } from 'motion/react'

export default function Banner() {
    return (
        <section className="w-full h-[60vh] flex items-center justify-center overflow-hidden">
            <motion.div
                initial={{ width: "70%" }}
                whileInView={{ width: "90%" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="banner h-full rounded-2xl shadow-2xl origin-center bg-blue-600"
            >
            </motion.div>
        </section>
    )
}
