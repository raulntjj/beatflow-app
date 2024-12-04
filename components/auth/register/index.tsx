"use client"

import Image from "next/image";
import Link from "next/link";
import { vector10, vector11, vector12, vector13, vector14, vector8, vector9 } from "../../../public";
import { motion } from 'framer-motion';
import { ArrowLeft } from "lucide-react";
import RegisterForm from "./form-register";

export default function Register() {

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: "linear", duration: 0.5, }} 
      className="relative flex items-center justify-center bg-background overflow-hidden"
    >
      <div className="md:flex w-full m-auto">
        <div className="relative z-0 hidden h-full min-h-screen w-fill md:w-[45%] lg:w-[40%] xl:w-[35%] md:flex justify-center items-center bg-foreground">
          <Image src={vector14} alt="" width={576} height={520} className="pointer-events-none absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 object-contain max-w-[250px] sm:max-w-[300px] md:max-w-[300px] lg:max-w-[380px]"/>
          <Image src={vector8} alt="" width={173} height={168} className="absolute pointer-events-none bottom-[70%] right-[2px] object-contain max-w-[50px] sm:max-w-[60px] md:max-w-[70px]"/>
          <Image src={vector9} alt="" width={173} height={168} className="absolute pointer-events-none bottom-[38%] right-[20px] object-contain max-w-[25px] sm:max-w-[28px] md:max-w-[32px]"/>
        </div>
        <div className="relative h-full min-h-screen w-full md:w-[55%] lg:w-[60%] xl:w-[65%] flex justify-center items-center">
          <Link href="/" className="absolute z-10 top-5 left-5 group/link text-foregorund">
            <span className="flex justify-center items-center group-hover/link:-translate-x-3 transition-all ease duration-300">
              <ArrowLeft size={34} className="text-foregorund mr-2" />
              Voltar para a página inicial
            </span>
          </Link>
          <RegisterForm />
          <Image src={vector13} alt="" width={173} height={168} className="absolute hidden md:block pointer-events-none bottom-[72%] left-[150px] object-contain max-w-[40px] sm:max-w-[60px] md:max-w-[110px] xl:min-w-[120px]"/>
          <Image src={vector12} alt="" width={173} height={168} className="absolute hidden md:block pointer-events-none bottom-[55%] left-[60px] object-contain max-w-[55px] sm:max-w-[68px] md:max-w-[90px] xl:min-w-[110px]"/>
          <Image src={vector11} alt="" width={173} height={168} className="absolute hidden md:block pointer-events-none bottom-[42%] left-[100px] object-contain max-w-[18px] sm:max-w-[28px] md:max-w-[32px] xl:min-w-[32px]"/>
          <Image src={vector10} alt="" width={173} height={168} className="absolute hidden md:block pointer-events-none bottom-[10%] -left-[25px] object-contain max-w-[60px] sm:max-w-[90px] md:max-w-[180px] xl:min-w-[190px]"/>
        </div>
      </div>
    </motion.div>
  );
}