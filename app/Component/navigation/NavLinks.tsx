"use client";

import { use } from "react";
import type { NavItem } from "./navConfig";
import { useRouter, usePathname } from "next/navigation";

interface Props {
  items: NavItem[];
}

export function useScrollTo() {
  const router = useRouter();
  const pathname = usePathname();

  const scrollTo = (id: string) => {
    if (pathname === "/") {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    router.push(`/#${id}`);

    const INTERVAL = 80;
    const TIMEOUT = 4000; // ms before giving up
    const start = Date.now();

    const poll = setInterval(() => {
      const el = document.getElementById(id);

      if (el) {
        clearInterval(poll);
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      if (Date.now() - start > TIMEOUT) {
        clearInterval(poll);
      }
    }, INTERVAL);
  };

  return scrollTo;
}

export default function NavLinks({ items }: Props) {
  const scrollTo = useScrollTo();

  return (
    <ul className="flex items-center gap-2 p-1 bg-white/5 dark:bg-black/10 rounded-xl border border-white/10 backdrop-blur-md">
      {items.map((item) => (
        <li key={item.id}>
          <button
            onClick={() => scrollTo(item.id)}
            className="relative px-4 py-2 text-sm font-bold transition-all group rounded-lg"
          >
            <span className="relative z-10 text-slate-800 dark:text-slate-100 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
              {item.name}
            </span>
            <span className="absolute inset-0 bg-cyan-500/10 dark:bg-cyan-400/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out border border-cyan-500/20" />
          </button>
        </li>
      ))}
    </ul>
  );
}
