// app/auth/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useMyContext } from "@/context";
import AuthForm from "@/components/auth-form";
import LoadingModal from "@/components/loading-modal";
import MobileError from "@/components/mobile-error";

const AuthPage = () => {
  const { isMobile, signUp, setSignUp } = useMyContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (signUp) {
      document.title = "Sign Up";
    } else {
      document.title = "Login";
    }
  });

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  if (isLoading) {
    return <LoadingModal />;
  }

  const toggleSignUp = () => {
    setSignUp((prev) => !prev);
  };

  return (
    <div role="auth-page" id="page--auth">
      {isMobile && <MobileError />}

      <h1 className="logo">TYPA</h1>
      <div className="cont--switch-auth">
        <p
          role="auth-tab-login"
          className={!signUp ? "auth-tab active" : "auth-tab"}
        >
          Login
        </p>
        <label tabIndex={0} className="switch">
          <input
            onChange={toggleSignUp}
            role="toggle-switch"
            name="checkbox"
            value=""
            id="inp--checkbox"
            type="checkbox"
          ></input>
          <span tabIndex={0} className="slider"></span>
        </label>
        <p
          role="auth-tab-sign-up"
          className={signUp ? "auth-tab active" : "auth-tab"}
        >
          Sign Up
        </p>
      </div>

      <AuthForm />
    </div>
  );
};

export default AuthPage;
