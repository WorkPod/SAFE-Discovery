// @ts-nocheck
import { Fragment, ReactNode, useState } from "react";
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import Header from "../components/Header.tsx";
import CssBaseline from "@mui/material/CssBaseline";
import Providers from "../components/providers/Providers";

export const metadata = {
  title: "safe-explorer-dapp",
  description: "safe-explorer-dapp",
};

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Layout({ children, className }: ContainerProps) {
  return (
    <div className="">
      <Providers>
        <CssBaseline />

        <Header />
        <div className="w-full">{children}</div>
      </Providers>
    </div>
  );
}
