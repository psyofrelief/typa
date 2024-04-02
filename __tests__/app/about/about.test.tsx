import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import About from "@/app/about/page";
import { MyProvider, MyContext } from "@/context";
import { useRouter } from "next/router"; // Import useRouter from Next.js
import Navbar from "@/components/navbar";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("About page", () => {
  it("Renders About Page without any errors", async () => {
    render(
      <MyProvider>
        <About />
      </MyProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByRole("about-page")).toBeInTheDocument();
    });
  });

  it("Renders information sections properly", async () => {
    render(
      <MyProvider>
        <About />
      </MyProvider>,
    );

    // check if all information sections are rendered
    await waitFor(() => {
      expect(screen.queryAllByTestId("section-test-info")).toHaveLength(3);
    });
  });

  it("Renders start test link", () => {
    render(
      <MyProvider>
        <About />
      </MyProvider>,
    );

    const startTestLink = screen.getByRole("test-link");
    expect(startTestLink).toBeInTheDocument();
  });

  it("Renders loading modal temporarily", async () => {
    render(
      <MyProvider>
        <About />
      </MyProvider>,
    );

    const loadingModal = screen.queryByRole("loading-modal");

    expect(loadingModal).toBeInTheDocument();

    await waitFor(() => {
      expect(loadingModal).not.toBeInTheDocument();
    });
  });

  it("Renders headings", () => {
    render(
      <MyProvider>
        <About />
      </MyProvider>,
    );

    const headings = screen.getAllByRole("heading");
    expect(headings).toHaveLength(3);
  });

  it("Renders MobileError component when isMobile is true", () => {
    render(
      <MyProvider>
        <MyContext.Consumer>
          {(value) => {
            // Log the value of isMobile
            value.isMobile = true;
            return <About />;
          }}
        </MyContext.Consumer>
      </MyProvider>,
    );

    // Check if MobileError component is rendered
    const mobileError = screen.queryByRole("mobile-error");
    expect(mobileError).toBeInTheDocument();
  });

  it("Doesn't render mobile error if isMobile is false", () => {
    render(
      <MyProvider>
        <MyContext.Consumer>
          {(value) => {
            value.isMobile = false;
            return <About />;
          }}
        </MyContext.Consumer>
      </MyProvider>,
    );

    // Check if MobileError component is rendered
    const mobileError = screen.queryByRole("mobile-error");
    expect(mobileError).not.toBeInTheDocument();
  });
});
