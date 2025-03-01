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
        <title>Transfer tokens | Home</title>
        <meta
          name="description"
          content="Transfer ETH/ERC20 tokens from connected wallet to another wallet by providing commands in text form."
        />
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
