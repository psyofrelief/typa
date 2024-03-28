"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useMyContext } from "@/context/index";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const {
    setSignUp,
    signUp,
    setUserName,
    isMobile,
    setIsMobile,
    userName,
    isLoggedIn,
    setIsLoggedIn,
  } = useMyContext();

  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    const username = localStorage.getItem("username");
    const booleanValue = loginStatus === "true";
    setIsLoggedIn(booleanValue);
    if (username) {
      setUserName(username);
    }

    // Retrieve active tab from local storage
    const storedActiveTab = localStorage.getItem("activeTab");
    if (storedActiveTab) {
      setActiveTab(storedActiveTab);
    }
  }, [isLoggedIn, userName]);

  useEffect(() => {
    const isMobileOrTablet = () => {
      const userAgent = navigator.userAgent;
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent,
      );
    };

    if (isMobileOrTablet()) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);

  const pathname = usePathname();
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    // Store active tab in local storage
    localStorage.setItem("activeTab", tabName);
  };

  return (
    <nav id="navbar">
      <div className="cont--nav-tabs">
        <Link
          href="/about"
          className={pathname === "/about" ? "nav-tab active" : "nav-tab"}
          onClick={() => handleTabClick("/about")}
        >
          About
        </Link>
        <Link
          href="/test"
          className={pathname === "/test" ? "nav-tab active" : "nav-tab"}
          onClick={() => handleTabClick("/test")}
        >
          Test
        </Link>
        <Link
          href="/history"
          className={pathname === "/history" ? "nav-tab active" : "nav-tab"}
          onClick={() => handleTabClick("/history")}
        >
          History
        </Link>
      </div>
      {!isLoggedIn ? (
        <div className="cont--auth-btns">
          <Link
            className={
              pathname === "/auth" && !signUp
                ? "btn-auth login active"
                : "btn-auth login"
            }
            href="/auth"
            onClick={() => {
              setSignUp(false);
            }}
          >
            Login
          </Link>
          <Link
            className="btn-auth signUp"
            href="/auth"
            onClick={() => {
              setSignUp(true);
            }}
          >
            Sign Up
          </Link>
        </div>
      ) : (
        <button
          className="btn-auth logout"
          onClick={() => {
            localStorage.setItem("isLoggedIn", "false");
            setIsLoggedIn(false);
          }}
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
