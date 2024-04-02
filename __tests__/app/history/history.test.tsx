import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import History from "@/app/history/page";
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

describe("History Page", () => {
  it("Renders History Page without any errors", async () => {
    act(() => {
      render(
        <MyProvider>
          <History />
        </MyProvider>,
      );
    });

    await waitFor(() => {
      expect(screen.queryByRole("history-page")).toBeInTheDocument();
    });
  });

  it("Renders table if user is logged in", async () => {
    act(() => {});
    render(
      <MyProvider>
        <MyContext.Consumer>
          {(value) => {
            // Log the value of isMobile
            value.isLoggedIn = true;
            return <History />;
          }}
        </MyContext.Consumer>
      </MyProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByRole("data-table")).toBeInTheDocument();
    });
  });

  it("Renders login prompt if user is not logged in", async () => {
    act(() => {
      render(
        <MyProvider>
          <MyContext.Consumer>
            {(value) => {
              // Log the value of isMobile
              value.isLoggedIn = false;
              return <History />;
            }}
          </MyContext.Consumer>
        </MyProvider>,
      );
    });
    await waitFor(() => {
      expect(screen.queryByRole("error-message-history")).toBeInTheDocument();
    });
  });
});
