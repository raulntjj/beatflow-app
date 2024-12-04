"use client"

import { motion } from 'framer-motion';
import Image from "next/image";
import { projectName } from '../../../utils/constants';
import { logo1 } from '../../../public';

export default function Loading() {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: "linear", duration: 0.5, }} 
      className="min-h-screen w-full flex flex-col items-center justify-center"
    >
      <div className="flex items-center justify-center">
        <Image src={logo1} alt={`${projectName} Image`} className="w-[200px] h-auto pointer-events-none" />
      </div>
    </motion.div>
  )
}