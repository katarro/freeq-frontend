import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Inicio",
    href: "/admin/home",
    icon: (
      <svg
        width="33"
        height="28"
        viewBox="0 0 33 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.1765 28V18.1176H19.7647V28H28V14.8235H32.9412L16.4706 0L0 14.8235H4.94118V28H13.1765Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "Perfil",
    href: "/admin/profile",
    icon: (
      <svg
        width="26"
        height="28"
        viewBox="0 0 26 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.41667 6.63158C6.41667 10.2878 9.29561 13.2632 12.8333 13.2632C16.3711 13.2632 19.25 10.2878 19.25 6.63158C19.25 2.97537 16.3711 0 12.8333 0C9.29561 0 6.41667 2.97537 6.41667 6.63158ZM24.2407 28H25.6667V26.5263C25.6667 20.8394 21.1878 16.2105 15.6852 16.2105H9.98148C4.47741 16.2105 0 20.8394 0 26.5263V28H24.2407Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

export default function FreeqNavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 bg-background left-0 right-0 grid grid-cols-2 h-[56px] border-t border-t-border">
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Button
            asChild
            variant="ghost"
            key={item.name}
            className="flex flex-col items-center text-sm h-full rounded-none shadow-none [&_svg]:!w-full [&_svg]:!h-full hover:text-muted-foreground"
          >
            <Link href={item.href}>
              <span
                className={cn(
                  "h-7",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {Icon}
              </span>
              <span className="mt-1 sr-only">{item.name}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
