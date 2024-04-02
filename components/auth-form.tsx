"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMyContext } from "@/context/index";

const AuthForm = () => {
  const { signUp, setUserName, setIsLoggedIn } = useMyContext();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
  });

  const authUser = async () => {
    try {
      const response = await fetch("../api/auth-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        setIsLoggedIn(true);
        setUserName(formData.username);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", formData.username);
        router.push("/about");
      } else {
        setIsLoggedIn(false);
        localStorage.setItem("isLoggedIn", "false");
        setErrorMessage("Incorrect username or password.");
        localStorage.removeItem("username");
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const createUser = async () => {
    try {
      const response = await fetch("../api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", formData.username);
        setIsLoggedIn(true);
        setUserName(formData.username);
        router.push("/about");
      }
    } catch (error: any) {
      setIsLoggedIn(false);
      console.log(error);
      return null;
    }
  };

  const checkUserExists = async () => {
    await fetch("../api/check-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: formData.username }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (!data.user_located) {
          await createUser();
        } else {
          setErrorMessage("Cannot create user, username already exists.");
        }
      })
      .catch((error: any) => console.log(error));
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    if (!value.length) {
      e.target.className = "";
      return;
    }

    if (name === "username") {
      const isFieldValid = usernameRegex.test(value);
      if (!isFieldValid) {
        e.target.className = "invalid";
        setErrorMessage(
          "Username must be 6-12 characters long and contain only alphanumerical characters",
        );
      }
    }

    if (name === "password") {
      const isFieldValid = passwordRegex.test(value);
      if (!isFieldValid) {
        e.target.className = "invalid";
        setErrorMessage(
          "Password must be 6-20 characters long and contain at least one uppercase letter and one number",
        );
      }
    }

    if (name === "passwordConfirm") {
      const isFieldValid = value === formData.password;
      if (!isFieldValid) {
        e.target.className = "invalid";
        setErrorMessage("Both passwords must match");
      }
    }
  };

  const validateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Start validating inputs only if 4 characters typed
    const { name, value } = e.target;
    if (value.length < 4) {
      return;
    }

    if (name === "username") {
      const isFieldValid = usernameRegex.test(value);
      if (isFieldValid) {
        e.target.className = "valid";
        setErrorMessage("");
      } else {
        e.target.className = "";
      }
    }

    if (name === "password") {
      const isFieldValid = passwordRegex.test(value);
      if (isFieldValid) {
        e.target.className = "valid";
        setErrorMessage("");
      } else {
        e.target.className = "";
      }
    }

    if (name === "passwordConfirm") {
      const isFieldValid = value === formData.password;
      if (isFieldValid) {
        e.target.className = "valid";
        setErrorMessage("");
      } else {
        e.target.className = "";
      }
    }
  };

  const isFormValid = () => {
    const usernameValidity = usernameRegex.test(formData.username);
    const passwordValidity = passwordRegex.test(formData.password);

    if (!usernameValidity) {
      setErrorMessage(
        "Username must be 6-12 characters long and contain only alphanumerical characters",
      );
      return false;
    }
    if (!passwordValidity) {
      setErrorMessage(
        "Password must be 6-20 characters long and contain at least one uppercase letter and one number",
      );
      return false;
    }

    if (signUp) {
      const passwordConfirmValidity =
        formData.password === formData.passwordConfirm;

      if (!passwordConfirmValidity) {
        setErrorMessage("Both passwords must match");
        return false;
      }
    }
    setErrorMessage("");
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Check validity of each input field and update classes
    validateInput(e);
  };

  const usernameRegex = /^[a-zA-Z0-9]{6,12}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,20}$/;

  const handleFormSubmission = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      return null;
    }
    if (signUp) {
      checkUserExists();
    } else {
      authUser();
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      passwordConfirm: "",
    });
    setErrorMessage("");
    const inputFields = document.querySelectorAll("input");
    inputFields.forEach((input) => (input.className = ""));
  };

  useEffect(() => {
    resetForm();
  }, [signUp]);

  return (
    <form role="auth-form" id="form--auth" onSubmit={handleFormSubmission}>
      <p className="brief">
        {signUp
          ? "Sign up and have full access to the website"
          : "Login to your account below"}
      </p>
      <label htmlFor="inp--username">
        Username
        <input
          id="inp--username"
          role="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          onBlur={handleBlur}
        />
        <p className="regex-symbol">
          ?
          <span className="regex-info">
            Username must be 6-12 characters long and contain only
            alphanumerical characters
          </span>
        </p>
      </label>
      <label htmlFor="inp--password">
        Password
        <input
          id="inp--password"
          name="password"
          role="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          onBlur={handleBlur}
        />
        <p className="regex-symbol">
          ?
          <span className="regex-info">
            Password must be 6-20 characters long and contain at least one
            uppercase letter and one number
          </span>
        </p>
      </label>
      {signUp && (
        <label htmlFor="inp--password-confirm">
          Confirm Password
          <input
            id="inp--password-confirm"
            name="passwordConfirm"
            role="password-confirm"
            type="password"
            value={formData.passwordConfirm}
            onChange={handleChange}
            placeholder="Confirm Password"
            onBlur={handleBlur}
          />
        </label>
      )}

      {errorMessage && (
        <p role="error-message-form" className="error-message">
          {errorMessage}
        </p>
      )}
      <button className="btn--submit" role="form-submit-btn" type="submit">
        {signUp ? "Create Account" : "Login"}
      </button>
    </form>
  );
};

export default AuthForm;
