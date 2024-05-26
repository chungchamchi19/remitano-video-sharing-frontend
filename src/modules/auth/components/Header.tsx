"use client"
import React, { memo } from "react";
import Link from "next/link";
import Login from "./Login";
import LoginPlaceholder from './LoginPlaceholder'
import Image from "next/image";
import { useAuthContext } from "../context";
import UserAction from "./UserAction";

const Header = () => {
  const { currentUser, loading } = useAuthContext();

  return (
    <header className="header-container p-[16px] lg:p-0 lg:h-[66px] lg:flex lg:justify-between lg:items-center border-b border-gray-300">
      <h1 className="title text-[36px] font-semibold mb-[8px] lg:mb-0">
        <Link className="no-style hover:text-black text-light-high flex" href="/">
          <Image src="/funny-movie.png" className="w-[48px] h-[48px] mr-12" width={48} height={48} alt="" />
          Funny Movies
        </Link>
      </h1>
      {loading ? <LoginPlaceholder/> : currentUser ? <UserAction email={currentUser.email} /> : <Login />}
    </header>
  );
};

export default memo(Header);
