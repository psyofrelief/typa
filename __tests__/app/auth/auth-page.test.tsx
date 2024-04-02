import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import { MyProvider, MyContext } from "@/context";
import AuthPage from "@/app/auth/page";

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

beforeAll(() => {
  fetchMock.enableMocks();
});

const responseData = {
  paragraph:
    "This is a test paragraph. This is the second sentence of the paragraph. This is another sentence of the paragraph.",
};

beforeEach(() => {
  fetchMock.mockResponseOnce(JSON.stringify(responseData));
});

describe("Auth Page", () => {
  it("Renders Auth page without any errors", async () => {
    render(
      <MyProvider>
        <AuthPage />
      </MyProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByRole("auth-page")).toBeInTheDocument();
    });
  });

  it("Renders auth form without any errors", async () => {
    render(
      <MyProvider>
        <AuthPage />
      </MyProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByRole("auth-form")).toBeInTheDocument();
    });
  });

  it("Toggles active class for auth tab based on signUp status", async () => {
    act(() => {
      render(
        <MyProvider>
          <MyContext.Consumer>
            {(value) => {
              value.signUp = true;
              return <AuthPage />;
            }}
          </MyContext.Consumer>
        </MyProvider>,
      );
    });

    await waitFor(() => {
      expect(screen.queryByRole("auth-tab-sign-up")).toBeInTheDocument();
    });

    const signUpTab = screen.queryByRole("auth-tab-sign-up");
    const loginTab = screen.queryByRole("auth-tab-login");

    expect(signUpTab).toHaveClass("active");
    expect(loginTab).not.toHaveClass("active");
  });

  it("Toggles active class for auth tab when toggle switch clicked", async () => {
    render(
      <MyProvider>
        <AuthPage />
      </MyProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByRole("toggle-switch")).toBeInTheDocument();
    });

    const toggleSwitch = screen.queryByRole("toggle-switch");
    const signUpTab = screen.queryByRole("auth-tab-sign-up");
    const loginTab = screen.queryByRole("auth-tab-login");

    act(() => {
      fireEvent.change(toggleSwitch);
    });

    await waitFor(() => {
      expect(loginTab).toHaveClass("active");
      expect(signUpTab).not.toHaveClass("active");
    });
  });
});
