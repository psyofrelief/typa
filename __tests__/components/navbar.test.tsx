import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import Navbar from "@/components/navbar";
import { MyProvider, MyContext } from "@/context";

describe("Navbar", () => {
  it("Renders Navbar without any errors", async () => {
    render(
      <MyProvider>
        <Navbar />
      </MyProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByRole("navbar")).toBeInTheDocument();
    });
  });

  it("Expect navbar tab to have active class when set in localStorage", async () => {
    localStorage.setItem("activeTab", "/about");
    const handleClick = jest.fn();
    render(
      <MyProvider>
        <Navbar onClick={handleClick} />
      </MyProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByRole("nav-tab-about")).toBeInTheDocument();
    });

    const navbarTab = screen.queryByRole("nav-tab-about");

    await waitFor(() => {
      expect(navbarTab).toHaveClass("active");
    });
  });

  it("Expect logout button to be in doc when logged in", async () => {
    render(
      <MyProvider>
        <MyContext.Consumer>
          {(value) => {
            value.isLoggedIn = true;
            return <Navbar />;
          }}
        </MyContext.Consumer>
      </MyProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByRole("logout-btn")).toBeInTheDocument();
    });
  });

  it("Expect logout button to not be in doc when not logged in", async () => {
    render(
      <MyProvider>
        <MyContext.Consumer>
          {(value) => {
            value.isLoggedIn = false;
            return <Navbar />;
          }}
        </MyContext.Consumer>
      </MyProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByRole("logout-btn")).not.toBeInTheDocument();
    });
  });

  it("Clicking Sign Up button sets signUp to true", async () => {
    const handleClick = jest.fn();
    const { signUp } = render(
      <MyProvider>
        <Navbar onClick={handleClick} />
      </MyProvider>,
    );
    await waitFor(() => {
      expect(screen.queryByRole("sign-up-btn")).toBeInTheDocument();
    });
    const signUpButton = screen.queryByRole("sign-up-btn");

    act(() => {
      fireEvent.click(signUpButton);
    });
    await waitFor(() => {
      expect(screen.queryByRole("login-btn")).not.toHaveClass("active");
    });
  });
});
