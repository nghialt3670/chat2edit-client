import React from "react";
import Logo from "../assets/logo.svg";

export default function AppLogo({ size }) {
  return (
    <div 
      className="rounded-full" 
      style={{
        zIndex: 1000,
        width: size,
        height: size,
      }}
    >
      <img
        className="size-full"
        src={Logo}
      />
    </div>
  );
}
