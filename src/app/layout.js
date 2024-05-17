import { Poppins } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const pop = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Real Time Quiz",
  description: "Made by Abhinav Singh",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${pop.className} bg-slate-100`}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
