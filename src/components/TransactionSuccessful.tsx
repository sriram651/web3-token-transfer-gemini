import Link from "next/link";
import React from "react";

export default function TransactionSuccessful({ url }: { url: string }) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary-500 hover:underline"
    >
      View it on Scan
    </Link>
  );
}
