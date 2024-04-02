import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import fetchMock from "jest-fetch-mock";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import AuthForm from "@/components/auth-form";
import { MyProvider, MyContext } from "@/context";

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: () => {},
  }),
}));

beforeEach(() => {
  fetchMock.enableMocks();
});

describe("Auth Form", () => {
  fetchMock.mockResponseOnce(JSON.stringify({ ok: true }));
  const handleChange = jest.fn();
  it("Renders error message when wrong form input data", async () => {
    render(
      <MyProvider>
        <AuthForm onChange={handleChange} />
      </MyProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByRole("auth-form")).toBeInTheDocument();
    });

    const usernameInput = screen.getByLabelText(/Username/i);
    act(() => {
      fireEvent.change(usernameInput, { target: { value: "fddy" } });
      fireEvent.blur(usernameInput);
    });

    await waitFor(() => {
      expect(usernameInput).toHaveClass("invalid");
      expect(screen.queryByRole("error-message-form")).toBeInTheDocument();
    });
  });

  it("Triggers login action on form submission with valid credentials", async () => {
    // Mock the response for successful authentication
    fetchMock.mockResolvedValueOnce({ ok: true });

    render(
      <MyProvider>
        <AuthForm />
      </MyProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByRole("auth-form")).toBeInTheDocument();
    });
    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.queryByRole("form-btn-submit");

    act(() => {
      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "Password123" } });
    });

    act(() => {
      fireEvent.submit(screen.queryByRole("auth-form"));
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("../api/auth-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "testuser",
          password: "Password123",
        }),
      });
    });

    await waitFor(() => {
      expect(window.localStorage.getItem("isLoggedIn")).toEqual("true");
      expect(window.localStorage.getItem("username")).toEqual("testuser");
    });
  });

  it("Triggers signup action on form submission with valid credentials", async () => {
    // Mock the response for successful authentication
    fetchMock.mockResolvedValueOnce({ ok: true });
    act(() => {
      render(
        <MyProvider>
          <MyContext.Consumer>
            {(value) => {
              value.signUp = true;
              return <AuthForm signUp={value.signUp} />;
            }}
          </MyContext.Consumer>
        </MyProvider>,
      );
    });

    await waitFor(() => {
      expect(screen.queryByRole("auth-form")).toBeInTheDocument();
      expect(screen.queryByRole("password-confirm")).toBeInTheDocument();
    });

    const usernameInput = screen.queryByRole("username");
    const passwordInput = screen.queryByRole("password");
    const passwordConfirmInput = screen.queryByRole("password-confirm");
    const submitButton = screen.queryByRole("form-btn-submit");

    act(() => {
      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "Password123" } });

      fireEvent.change(passwordConfirmInput, {
        target: { value: "Password123" },
      });
    });
    act(() => {
      fireEvent.submit(screen.queryByRole("auth-form"));
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("../api/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "testuser",
        }),
      });
    });

    await waitFor(() => {
      expect(window.localStorage.getItem("isLoggedIn")).toEqual("true");
      expect(window.localStorage.getItem("username")).toEqual("testuser");
    });
  });
});
