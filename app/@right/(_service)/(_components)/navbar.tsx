// @/app/@right/(_service)/(_components)/navbar.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import {
  navBarConfigs,
  navBarPublicConfig,
  NavBarLayout,
} from "../(_config)/nav-bar-config";
import { appConfig } from "@/config/appConfig";
import { useSession } from "next-auth/react";
import { UserType } from "@prisma/client";

interface NavBarProps {
  scroll?: boolean;
  large?: boolean;
}

export function NavBar({ scroll = false }: NavBarProps) {
  const scrolled = useScroll(50);
  const selectedLayout = useSelectedLayoutSegment();

  console.log(" selectedLayout NavBar", selectedLayout);

  const { data: session } = useSession();
  const userType: UserType = session?.user?.type || "guest";

  const links =
    selectedLayout &&
    Object.prototype.hasOwnProperty.call(navBarConfigs, selectedLayout)
      ? navBarConfigs[selectedLayout as NavBarLayout]
      : navBarPublicConfig.mainNav;

  const filteredLinks = links.filter(
    (item) => !item.roles || item.roles.includes(userType)
  );

  return (
    <header
      className={`sticky top-0 z-40 flex w-20 md:w-full justify-start px-2 bg-background/60 backdrop-blur-xl mr-12 transition-all ${
        scroll ? (scrolled ? "border-b" : "bg-transparent") : "border-b"
      }`}
    >
      <div className="flex h-14 items-center justify-between py-4">
        <div className="flex gap-4 ">
          <Link href="/" className="flex items-center space-x-1.5">
            <Image
              src="/favicons/logo.png"
              alt={appConfig.name}
              width={32}
              height={32}
              className="rounded-md min-size-8 min-w-8"
              priority
            />
          </Link>

          {filteredLinks && filteredLinks.length > 0 ? (
            <nav className="hidden gap-6 md:flex">
              {filteredLinks.map((item, index) => (
                <Link
                  key={index}
                  href={item.disabled ? "#" : item.href}
                  prefetch={true}
                  className={cn(
                    "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                    item.href.startsWith(`/${selectedLayout}`)
                      ? "text-foreground"
                      : "text-foreground/60",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
      </div>
    </header>
  );
}
