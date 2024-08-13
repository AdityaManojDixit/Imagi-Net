import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], 
  weight:['400', '500', '600', '700'], //Font weights
  variable: '--font-inter' //Variable to trigger or turn-on font
});

export const metadata: Metadata = {
  title: "ImagiNet",
  description: "AI Powered Image Editor.",
};

export default function RootLayout( {children,}: Readonly<{children: React.ReactNode;}>) 
{
  //CSS Property: antialiased makes font easier to read
  return (
    <html lang="en">
      <body className={cn("font-inter antialiased", inter.variable)}> 
        {children}
      </body>
    </html>
  );
}
