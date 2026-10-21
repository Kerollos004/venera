"use client"
import React from 'react'
import { useRef } from 'react'
import { motion, useScroll  , useTransform,  } from 'motion/react'
export default function Banner() {
    const containerRef = useRef(null)
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })
    const bannerWidth = useTransform(scrollYProgress, [0, 0.5], ["70%", "90%"])        
    
    return (
<section 
            ref={containerRef} 
            className="w-full h-[60vh] flex items-center justify-center overflow-hidden"
        >
            <motion.div
                style={{ width: bannerWidth }} 
                className="banner h-full b rounded-2xl shadow-2xl origin-center"
                transition={{ duration: 0.8 }}
            >
            </motion.div>
        </section>
    )
}
