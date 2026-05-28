import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/dashboard/Navbar";

export const metadata: Metadata = {
  title: "VambeAI — Sales Intelligence Dashboard",
  description: "Categorización automática y métricas de clientes con IA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.theme==='dark')document.documentElement.classList.add('dark')}catch{}`,
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-slate-100">
        <Navbar />
        <main className="max-w-screen-2xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
