import Navbar from "@/components/navbar";
import React, { type PropsWithChildren } from "react";

const Layout = (props: PropsWithChildren) => {
  return (
    <>
      {/* <Navbar /> */}
      {props.children}
    </>
  );
};

export default Layout;
