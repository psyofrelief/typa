import "@testing-library/jest-dom";
import { calculateCPM } from "@/app/test/page"; // Import the calculateCPM function directly
import fetchMock from "jest-fetch-mock";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import Test from "@/app/test/page";
import { MyProvider, MyContext } from "@/context";

jest.useFakeTimers();
const responseData = {
  paragraph:
    "This is a test paragraph. This is the second sentence of the paragraph. This is another sentence of the paragraph.",
};

beforeEach(() => {
  fetchMock.resetMocks();
  fetchMock.mockResponseOnce(JSON.stringify(responseData));
});

describe("Test Page", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  it("Renders Test Page without any errors", async () => {
    render(
      <MyProvider>
        <Test />
      </MyProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByRole("test-page")).toBeInTheDocument();
    });
  });

  it("Renders paragraph loading modal temporarily", async () => {
    render(
      <MyProvider>
        <Test />
      </MyProvider>,
    );

    const paragraphLoader = screen.queryByRole("paragraph-loader");
    expect(paragraphLoader).toBeInTheDocument();
    await waitFor(() => {
      expect(paragraphLoader).not.toBeInTheDocument();
    });
  });

  it("Removes start button once it's clicked", async () => {
    const handleClick = jest.fn();
    render(
      <MyProvider>
        <Test onClick={handleClick} />
      </MyProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByRole("start-test")).toBeInTheDocument();
    });

    const startButton = screen.queryByRole("start-test");

    act(() => {
      fireEvent.click(startButton);
    });

    expect(startButton).not.toBeInTheDocument();
  });

  it("Renders paragraph without any errors", async () => {
    render(
      <MyProvider>
        <Test />
      </MyProvider>,
    );
    await waitFor(() => {
      expect(screen.queryByRole("paragraph")).toBeInTheDocument();
    });
  });

  it("Renders reset modal when test has begun", async () => {
    const handleClick = jest.fn();
    render(
      <MyProvider>
        <Test onClick={handleClick} />
      </MyProvider>,
    );
    await waitFor(() => {
      expect(screen.queryByRole("start-test")).toBeInTheDocument();
    });

    const startButton = screen.queryByRole("start-test");

    act(() => {
      fireEvent.click(startButton);
    });

    const resetTestModal = screen.queryByRole("reset-test-modal");

    expect(resetTestModal).toBeInTheDocument();
  });

  it("Updates test when an option is toggled", async () => {
    const handleClick = jest.fn();
    render(
      <MyProvider>
        <Test onClick={handleClick} />
      </MyProvider>,
    );
    await waitFor(() => {
      expect(
        screen.queryByRole("settings-option-duration"),
      ).toBeInTheDocument();
    });

    const durationOption = screen.queryByRole("settings-option-duration");
    act(() => {
      fireEvent.click(durationOption);
    });

    const timer = screen.queryByRole("timer");
    expect(timer).toHaveTextContent("90");
  });

  it("Renders first letter of paragraph with correct highlight option", async () => {
    act(() => {
      localStorage.setItem("activeHighlightOption", "Caret"); // Set active highlight option to 'Caret'
    });
    render(
      <MyProvider>
        <Test />
      </MyProvider>,
    );
    await waitFor(() => {
      expect(screen.queryByRole("letter")).toBeInTheDocument();
    });

    const firstLetter = screen.queryByRole("letter");
    expect(firstLetter).toHaveTextContent("t");

    const activeHighlightOption = localStorage.getItem("activeHighlightOption");

    if (activeHighlightOption === "Caret") {
      expect(firstLetter).toHaveClass("caret");
    } else {
      expect(firstLetter).toHaveClass("character");
    }
  });

  it("Hides timer if activeTimerOption is false", async () => {
    act(() => {
      localStorage.setItem("activeTimerOption", "false");
    });
    render(
      <MyProvider>
        <Test />
      </MyProvider>,
    );
    await waitFor(() => {
      expect(screen.queryByRole("timer")).not.toBeInTheDocument();
    });
  });

  it("Renders paragraph as lowercase and unpunctuated when activePunctiation option is false", async () => {
    localStorage.setItem("activePunctuationOption", "false");
    render(
      <MyProvider>
        <Test />
      </MyProvider>,
    );
    await waitFor(() => {
      expect(screen.queryByRole("letter")).toBeInTheDocument();
    });

    const firstLetterOfParagraph = screen.queryByRole("letter");
    expect(firstLetterOfParagraph).toHaveTextContent("t");
  });

  it("Renders second sentence in visible paragraph", async () => {
    render(
      <MyProvider>
        <Test />
      </MyProvider>,
    );
    await waitFor(() => {
      expect(screen.queryByRole("second-sentence")).toBeInTheDocument();
    });
  });

  it("Stops test after timer finishes countdown", async () => {
    localStorage.setItem("activeDurationOption", "1");
    const handleClick = jest.fn();
    act(() => {
      render(
        <MyProvider>
          <Test onClick={handleClick} />
        </MyProvider>,
      );
    });
    await waitFor(() => {
      expect(screen.queryByRole("paragraph")).toBeInTheDocument();
    });

    const startButton = screen.queryByRole("start-test");

    act(() => {
      fireEvent.click(startButton);
    });
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    await waitFor(() => {
      expect(screen.queryByRole("start-test")).toBeInTheDocument();
    });
  });

  it("Resets test when reset button is clicked", async () => {
    localStorage.setItem("activeDurationOption", "10");

    localStorage.setItem("activeTimerOption", "true");
    const handleClick = jest.fn();
    render(
      <MyProvider>
        <Test onClick={handleClick} />
      </MyProvider>,
    );
    await waitFor(() => {
      expect(screen.queryByRole("reset-test")).toBeInTheDocument();
    });

    const startButton = screen.queryByRole("start-test");
    const resetButton = screen.queryByRole("reset-test");
    const timer = screen.queryByRole("timer");

    act(() => {
      fireEvent.click(startButton);
    });

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    act(() => {
      fireEvent.click(resetButton);
    });

    await waitFor(() => {
      expect(timer).toHaveTextContent("10");
      expect(screen.queryByRole("start-test")).toBeInTheDocument();
    });
  });
});
