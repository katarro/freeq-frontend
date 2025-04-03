"use client";

import { useState, useEffect } from "react";
import LoginForm from "@/components/forms/login-form";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

export default function LoginPage() {
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const isMobile = useIsMobile();

  const rightValue = isMobile ? "240%" : "100%";

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowForm(true), 50);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative overflow-hidden min-h-screen w-full">
      <AnimatePresence>
        {loading ? (
          <motion.main
            key="loading"
            className="freeq-gradient fixed inset-0 h-[100dvh] w-full py-10 z-20"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 1,
              y: -1000,
              transition: {
                duration: 0.8,
                ease: "easeInOut",
              },
            }}
            onAnimationStart={() => {
              if (!loading) {
                setShowForm(true);
              }
            }}
          >
            {/* SVG superior - animación de derecha a izquierda */}
            <motion.div
              className="absolute -right-full top-10 w-full opacity-0 md:opacity-100"
              initial={{ right: "-100%", opacity: 0 }}
              animate={{
                right: rightValue,
                opacity: 1,
                transition: {
                  delay: 1,
                  duration: 1,
                  ease: "easeOut",
                },
              }}
              exit={{ opacity: 0 }}
            >
              <svg
                className="w-[800px]"
                xmlns="http://www.w3.org/2000/svg"
                width="827"
                height="68"
                viewBox="0 0 827 68"
                fill="none"
              >
                <path
                  d="M568.961 0.0183816H0C37.7371 7.09529 71.5039 14.3928 102.697 22.5174H819.868L826.43 1.87492L827 0H568.961V0.0183816Z"
                  fill="white"
                />
                <path
                  d="M176.296 45.0342C195.339 51.817 213.684 59.2431 231.863 67.5332H805.622L812.754 45.0342H176.296Z"
                  fill="#E7E7E7"
                />
              </svg>
            </motion.div>

            {/* SVG inferior - animación de izquierda a derecha */}
            <motion.div
              className="absolute -left-full bottom-10 w-full opacity-0 md:opacity-100"
              initial={{ left: "-100%", opacity: 0 }}
              animate={{
                left: "100%",
                opacity: 1,
                transition: {
                  delay: 1,
                  duration: 1,
                  ease: "easeOut",
                },
              }}
              exit={{ opacity: 0 }}
            >
              <svg
                className="w-[800px]"
                xmlns="http://www.w3.org/2000/svg"
                width="827"
                height="68"
                viewBox="0 0 827 68"
                fill="none"
              >
                <path
                  d="M568.961 0.0183816H0C37.7371 7.09529 71.5039 14.3928 102.697 22.5174H819.868L826.43 1.87492L827 0H568.961V0.0183816Z"
                  fill="white"
                />
                <path
                  d="M176.296 45.0342C195.339 51.817 213.684 59.2431 231.863 67.5332H805.622L812.754 45.0342H176.296Z"
                  fill="#E7E7E7"
                />
              </svg>
            </motion.div>

            <div className="absolute left-1/2 top-1/2 grid min-h-[140px] w-full -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg p-6">
              <figure className="w-[255px] h-[128px] relative">
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{
                    scale: 1.2,
                    transition: {
                      delay: 0.6,
                      duration: 0.5,
                      ease: "easeOut",
                    },
                  }}
                >
                  <Image
                    src="/images/logo-white.avif"
                    alt="FREEQ Logo"
                    width={499}
                    height={499}
                    priority
                    className="top-0 left-0 w-full h-full"
                  />
                </motion.div>
              </figure>
            </div>
          </motion.main>
        ) : null}
      </AnimatePresence>

      <motion.main
        key="content"
        className="min-h-screen w-full bg-background fixed inset-0 overflow-y-auto"
        initial={{ y: "100vh" }}
        animate={{
          y: loading ? "100vh" : 0,
          transition: {
            duration: 0.8,
            ease: "easeOut",
            delay: loading ? 999 : 0,
          },
        }}
      >
        <div className="flex flex-col min-h-screen">
          <Image
            src="/images/banner.avif"
            alt="FREEQ Logo"
            width={499}
            height={10}
            priority
            className="w-full h-3"
          />
          <motion.div
            className="flex-1 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{
              opacity: showForm ? 1 : 0,
              transition: {
                delay: 0.3,
                duration: 0.5,
              },
            }}
          >
            {showForm && <LoginForm />}
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}

