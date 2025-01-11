import Image from "next/image";
import { Button } from "@nextui-org/react";

export default function Header() {
  return (
    <header className="w-full bg-default-50 shadow-lg sticky top-0 z-50">
      <div className="w-full max-w-screen-2xl mx-auto p-4 md:px-10 flex justify-between items-center">
        <Image
          src="/logo.png"
          alt="logo"
          width={50}
          height={50}
          className="rounded-full"
        />

        <Button color="default" size="md" radius="md">
          Connect Wallet
        </Button>
      </div>
    </header>
  );
}
