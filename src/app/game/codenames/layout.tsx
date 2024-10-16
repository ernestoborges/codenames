'use client'
import { TokenProvider } from "../../../context/token";

export default function CodenamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TokenProvider>
      {children}
    </TokenProvider>
  );
}