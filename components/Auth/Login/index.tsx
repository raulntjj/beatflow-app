"use client"

import Image from "next/image";
import { vector1, vector2, vector3, vector4, vector5, vector6, vector7 } from "@/public";
import LoginForm from "./LoginForm";
import { motion } from 'framer-motion';

export default function LoginHome() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: "linear", duration: 0.5, }} 
      className="relative flex items-center justify-center bg-background overflow-hidden"
    >
      <div className="md:flex w-full m-auto">
        <div className="relative h-full min-h-screen w-fill md:w-[55%] lg:w-[60%] xl:w-[65%] flex justify-center items-center">
          <LoginForm />
          <Image src={vector1} alt="" width={576} height={520} className="absolute pointer-events-none bottom-0 left-0 object-contain max-w-[250px] sm:max-w-[300px] md:max-w-[330px]"/>
          <Image src={vector2} alt="" width={173} height={168} className="absolute pointer-events-none bottom-[70%] -right-[25px] object-contain max-w-[100px] sm:max-w-[124px] md:max-w-[154px]"/>
          <Image src={vector3} alt="" width={72} height={128} className="absolute pointer-events-none bottom-[30%] -right-[2px] object-contain max-w-[52px] sm:max-w-[52px] md:max-w-[62px]"/>
        </div>
        <div className="relative h-full min-h-screen hidden md:w-[45%] lg:w-[40%] xl:w-[35%] md:flex justify-center items-center bg-foreground">
          <div className="h-full flex items-center justify-center">
            <h1 className="sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center text-background">
                Sua música,<br /> sua rede,<br /> seu mundo.
            </h1>
          </div>
          <Image src={vector4} alt="" width={173} height={168} className="absolute pointer-events-none bottom-10 -left-3"/>
          <Image src={vector5} alt="" width={87} height={103} className="absolute pointer-events-none bottom-[15%] right-[20%]"/>
          <Image src={vector6} alt="" width={72} height={128} className="absolute pointer-events-none top-[5%] left-[20%]"/>
          <Image src={vector7} alt="" width={72} height={70} className="absolute pointer-events-none top-[10%] right-[20%]"/>
        </div>
      </div>
    </motion.section>
  );
}