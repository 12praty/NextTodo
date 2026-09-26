//this is the main wrapper around your pages
import type { Metadata } from "next";//information abot webpages
import { Toaster } from "@/components/ui/sonner";
import "@/app/globals.css"; //gobal css file for application


export const metadata: Metadata = {
  title: "Todo-app"

};

// main wrapper function that wrappes my entire nextjs application
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}