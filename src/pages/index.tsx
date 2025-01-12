import localFont from "next/font/local";
import Header from "@/components/Header";
import HomePage from "@/components/home/HomePage";
import Head from "next/head";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Welcome to the Home Page" />
      </Head>
      <div
        className={`${geistSans.variable} ${geistMono.variable} h-full min-h-screen font-[family-name:var(--font-geist-sans)]`}
      >
        <Header />
        <HomePage />
      </div>
    </>
  );
}
