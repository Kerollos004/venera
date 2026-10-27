"use client"
import { useTranslation } from "react-i18next"
import { useThemeContext } from "../assets/contexts"
import { motion } from "motion/react"
import { Variants } from "motion/react"
export default function Services() {
    const { mode } = useThemeContext()
    const {t} = useTranslation()
    const boxsVariatns:Variants = {
        hidden: {
            y:"20px"
        },
        visible: {
            y: "0",
            transition: {
                staggerChildren: .5,
                type: "spring",     
                stiffness: 100 
            }
        }
    }
    const boxVariants:Variants={
        hidden: {
            y:"20px"
        },
        visible: {
            y:0
        }
    }
    return (
        <section className="px-3.5 md:px-10 py-10 ">
            <motion.h3
                initial={{ opacity: 0, y: "-20px" }}
                whileInView={{ opacity: 1, y: "0" }}
                viewport={{amount:.5 , once:true}}
                className="text-4xl text-center text-blue-600 mb-4"
            >
                {t("services.serviceTitle")}
            </motion.h3>

            <motion.article
                variants={boxsVariatns}
                initial="hidden"
                whileInView="visible"
                viewport = {{amount:.4 , once:true}}
                className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 "
            >
                <motion.article variants={boxVariants}   className={` ${mode==="light"?"bg-gray-300 text-black":"bg-[#1e293b] text-white"}  p-5 rounded-3xl    border-t-6 border-blue-600`}>
                    <h3 className="text-3xl mb-2.5">{t("services.firstService.title") }</h3>
                    <p>{t("services.firstService.desc") }</p>
                </motion.article>
                <motion.article variants={boxVariants}   className={` ${mode==="light"?"bg-gray-300 text-black":"bg-[#1e293b] text-white"}  p-5 rounded-3xl    border-t-6 border-blue-600`}>
                    <h3 className="text-3xl mb-2.5"> {t("services.secondService.title") }</h3>
                    <p>{t("services.secondService.desc") }</p>
                </motion.article>
                <motion.article  variants={boxVariants}  className={` ${mode==="light"?"bg-gray-300 text-black":"bg-[#1e293b] text-white"}  p-5 rounded-3xl  border-t-6 border-blue-600`}>
                    <h3 className="text-3xl mb-2.5">{t("services.thirdService.title") } </h3>
                    <p>{t("services.thirdService.desc") }</p>
                </motion.article>
            </motion.article>
        </section>
    )
}
