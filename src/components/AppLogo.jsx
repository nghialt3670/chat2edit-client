import React from "react";
import Logo from "../assets/logo.svg";

export default function AppLogo({ size }) {
  return (
    <img
      src={Logo}
      style={{
        zIndex: 1000,
        width: size,
        height: size,
      }}
    />
  );
}
