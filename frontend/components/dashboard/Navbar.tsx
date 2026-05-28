"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Users, Zap, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

const links = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/clients", label: "Clientes", icon: Users },
];

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.theme = next ? "dark" : "light"; } catch {}
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
      title={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
      <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-brand-600 text-white rounded-lg p-1.5">
            <Zap className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-lg">VambeAI</span>
          <span className="text-slate-400 text-sm ml-1">Sales Intelligence</span>
        </div>
        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-50 dark:bg-brand-700/20 text-brand-600 dark:text-brand-400"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
          <div className="ml-2 pl-2 border-l border-slate-200 dark:border-slate-700">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
