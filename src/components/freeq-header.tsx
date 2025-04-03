import Image from "next/image";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { useRef } from "react";

export default function FreeqHeader() {
  const triggerSidebarRef = useRef<HTMLButtonElement>(null);

  const handleSidebarTrigger = () => {
    triggerSidebarRef.current?.click();
  };

  return (
    <header className="z-10 sticky shadow-lg top-0 left-0 w-full h-[68px] overflow-hidden grid grid-cols-2 items-center bg-primary">
      <Link
        href="/admin/home"
        className="h-full lg:hidden flex pl-4"
        aria-label="Inicio"
      >
        <Image
          className="my-auto"
          src="/images/logo-freeq-2.avif"
          alt="FreeQ Logo"
          width={93}
          height={36}
        />
      </Link>
      <svg
        className="absolute top-0 bottom-0 left-10 w-full h-[68px] -z-[1]"
        width="247"
        height="67"
        viewBox="0 0 247 67"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="w-full h-[68px]"
          d="M301.274 0.0546939H0C19.9824 21.1118 37.8625 42.8253 54.3798 67H434.133L437.608 5.57878L437.91 0H301.274V0.0546939Z"
          fill="#00BAB4"
        />
      </svg>
      <svg
        className="absolute top-0 bottom-0 left-14 right-0 w-full h-[68px] -z-[1]"
        width="216"
        height="67"
        viewBox="0 0 216 67"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-input"
          d="M301.274 0.0546939H0C19.9824 21.1118 37.8625 42.8253 54.3798 67H434.133L437.608 5.57878L437.91 0H301.274V0.0546939Z"
          fill="currentColor"
        />
      </svg>
      <div className="relative flex h-full bg-input justify-end lg:col-start-2">
        <Button
          onClick={handleSidebarTrigger}
          variant="ghost"
          className="h-full shadow-none rounded-none px-4"
          aria-label="Menú de navegación"
        >
          <figure className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              className="w-full h-full object-cover"
              src="/images/user-photo.avif"
              alt="FreeQ Logo"
              width={40}
              height={40}
            />
          </figure>
          <p className="text-sm">Felipe Castro</p>
        </Button>
        <SidebarTrigger
          ref={triggerSidebarRef}
          className="sr-only"
          aria-label="Menú de navegación"
        />
      </div>
    </header>
  );
}
