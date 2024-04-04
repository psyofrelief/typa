// app/test/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useMyContext } from "@/context/index";
import LoadingModal from "@/components/loading-modal";
import MobileError from "@/components/mobile-error";
import Loader from "@/components/loader";
const Test = () => {
  const { userName, isLoggedIn, isMobile } = useMyContext();
  // States that manage loading functionalities
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isParagraphLoading, setIsParagraphLoading] = useState<boolean>(true);

  // States that manage test options
  const [activeDurationOption, setActiveDurationOption] = useState<number>(60);
  const [activeHighlightOption, setActiveHighlightOption] =
    useState<string>("Character");
  const [activePunctuationOption, setActivePunctuationOption] =
    useState<boolean>(true);
  const [activeTimerOption, setActiveTimerOption] = useState<boolean>(true);

  // States that manage paragraph and typing
  const [paragraph, setParagraph] = useState<string>("");
  const [prevUserInput, setPrevUserInput] = useState<string>("");
  const [sentences, setSentences] = useState<string[]>([]);
  const [sentenceIndex, setSentenceIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>("");

  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(activeDurationOption);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState<number>(0);
  const [CPM, setCPM] = useState<number>(0);
  const [WPM, setWPM] = useState<number>(0);

  useEffect(() => {
    document.title = "Typa | Test";
  }, []);

  const fetchParagraph = async () => {
    setIsParagraphLoading(true);
    try {
      const response = await fetch("../api/paragraphs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      let sentencesArray = data.paragraph.split(/(?<=[.!?])\s+/);

      sentencesArray = sentencesArray.filter(
        (sentence: string) => sentence.trim() !== "",
      );

      let modifiedSentences = sentencesArray.map(
        (sentence: string, index: number) => {
          if (index === sentencesArray.length - 1) {
            return sentence.trim(); // Remove trailing spaces from the last sentence
          } else {
            return sentence.trim() + " "; // Add a space at the end of other sentences
          }
        },
      );

      let paragraphText = modifiedSentences.join(" ");
      const storedPunctuationOption = localStorage.getItem(
        "activePunctuationOption",
      );
      // Remove punctuation if punctuation is off
      if (storedPunctuationOption !== "true") {
        // Remove punctuation and convert to lowercase for each sentence
        modifiedSentences = modifiedSentences.map((sentence: string) =>
          sentence
            .replace(/[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/g, "")
            .toLowerCase(),
        );
        // Join the processed sentences into the paragraph text
        paragraphText = modifiedSentences.join("");
      }

      setParagraph(paragraphText);
      setSentences(modifiedSentences);
    } catch (error: any) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsParagraphLoading(false);
        setIsLoading(false);
      }, 150);
    }
  };

  // Handles keypress actions, displays correct or incorrect state for letters
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === " ") {
      event.preventDefault();
    }

    // End game on Enter keypress
    if (event.key === "Enter") {
      event.preventDefault();
      resetTest();
    }

    if (event.key === "'" || event.key === "’") {
      event.preventDefault();
      setUserInput((prevState) => prevState + event.key);
    }

    // Whitelist of allowed key codes (alphanumeric keys)
    const allowedKeyCodes = [
      // Generate an array containing uppercase letters from A to Z (ASCII 65 to 90)
      ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)), // A-Z
      // Generate an array containing numbers from 0 to 9 (ASCII 48 to 57)
      ...Array.from({ length: 10 }, (_, i) => String.fromCharCode(48 + i)), // 0-9
      " ",
      "BACKSPACE",
      "Tab",
      "Shift",
      ",",
      ".",
      ";",
      ":",
    ];

    // Ignore if key pressed is not in the whitelist
    if (!allowedKeyCodes.includes(event.key.toUpperCase())) {
      return;
    }

    // Handle backspace key
    if (event.key === "Backspace") {
      setUserInput((prevState) => prevState.slice(0, -1)); // Remove the last character
      setPrevUserInput((prev) => prev.slice(0, -1));
      // if the shift key is pressed with a alphanumeric character
    } else if (event.shiftKey && event.key !== "Shift") {
      setUserInput((prevState) => prevState + event.key.toUpperCase());
      setPrevUserInput((prev) => prev + event.key.toUpperCase());
      // if the key pressed is a valid alphanumeric key
    } else if (!event.ctrlKey && event.key !== "Shift") {
      setUserInput((prevState) => prevState + event.key);
      setPrevUserInput((prev) => prev + event.key);
    }
  };

  // Compare user input with original paragraph
  const endTest = () => {
    window.removeEventListener("keydown", handleKeyPress);
    calcStats();
  };

  const calculateWPM = () => {
    // Regular expression to split text into words, considering common punctuation marks
    const words = prevUserInput.split(" ");
    let wordsLength = words.length;
    const lastCharacterTyped = prevUserInput.split(" ")[wordsLength - 1];

    if (lastCharacterTyped == "") {
      wordsLength = wordsLength - 1;
    }
    const minutes = activeDurationOption / 60;
    const wpm = wordsLength / minutes;
    setWPM(wpm);
  };

  const calculateCPM = () => {
    // Remove spaces and punctuation marks from the user input
    const cleanedInput = prevUserInput.replace(
      /[\s.,\/#!$%\^&\*;:{}=\-_`~()]/g,
      "",
    );
    const characters = cleanedInput.length; // Get the total number of characters typed
    const minutes = activeDurationOption / 60; // Convert test duration to minutes
    const cpm = Math.round(characters / minutes); // Calculate CPM
    setCPM(cpm); // Update the CPM state
  };

  const calculateAccuracy = () => {
    const totalCharacters = sentences
      .slice(0, sentenceIndex + 1)
      .join("")
      .replace(/\s/g, "").length; // Count total characters in the joined sentences without spaces

    const accuracyPercentage = parseFloat(
      ((1 - mistakes / totalCharacters) * 100).toFixed(2),
    ); // Calculate accuracy percentage

    setAccuracy(accuracyPercentage); // Update accuracy state
  };

  // Calculate and display user stats
  const calcStats = () => {
    calculateWPM();
    calculateAccuracy();
    calculateCPM();
  };

  // Start the game
  const startTest = () => {
    window.addEventListener("keydown", handleKeyPress);
    setMistakes(0);
    setIsTyping(true);
  };

  // Reset game back to original state
  const resetTest = () => {
    window.removeEventListener("keydown", handleKeyPress);
    setIsTyping(false);
    setTimeLeft(activeDurationOption);
    setUserInput("");
    setPrevUserInput("");
    fetchParagraph();
  };

  // Handles ending the game and calculating / displaying the stats
  const handleDurationOptionClick = (time: number) => {
    setActiveDurationOption(time);
    localStorage.setItem("activeDurationOption", time.toString());
  };

  const handleHighlightOptionClick = (style: string) => {
    setActiveHighlightOption(style);
    localStorage.setItem("activeHighlightOption", style);
  };

  const handlePunctuationOptionClick = (punctuationValue: boolean) => {
    setActivePunctuationOption(punctuationValue);
    localStorage.setItem(
      "activePunctuationOption",
      punctuationValue.toString(),
    );
    fetchParagraph();
  };

  const handleTimerOptionClick = (show: boolean) => {
    setActiveTimerOption(show);
    localStorage.setItem("activeTimerOption", show.toString());
  };

  const submitUserResults = async () => {
    try {
      await fetch("../api/submit-user-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          wpm: WPM,
          cpm: CPM,
          accuracy: accuracy,
        }),
      });
    } catch (error: any) {
      console.log(error);
    } finally {
      resetTest();
    }
  };

  // Handles counting mistakes
  const renderCharacter = (char: string, index: number) => {
    let className = "base";
    let role = "";
    if (index === userInput.length) {
      // If the character is at the current cursor position, apply caret or character class
      if (activeHighlightOption === "Caret") {
        className += " caret";
        role = "letter";
      } else {
        className += " character";
        role = "letter";
      }
    } else if (index < userInput.length) {
      // If the character has been typed, compare with original and apply correct/incorrect class
      if (char === userInput[index]) {
        className += " correct";
      } else {
        className += " incorrect";
        role = "invalid";
      }
    }
    return (
      <span role={role} key={index} className={className}>
        {char}
      </span>
    );
  };

  const nextSentence = () => {
    if (sentenceIndex < sentences.length - 1) {
      setSentenceIndex((prevIndex) => prevIndex + 1);
      setUserInput(""); // Reset user input for the next sentence
    } else {
      // All sentences have been completed
      setSentenceIndex(0);
      setUserInput(""); // Reset user input for the next sentence
      setIsTyping(false);
    }
  };

  // Updates states to match localStorage states
  useEffect(() => {
    // Retrieve active options from local storage
    const storedDurationOption = localStorage.getItem("activeDurationOption");
    const storedHighlightOption = localStorage.getItem("activeHighlightOption");
    const storedPunctuationOption = localStorage.getItem(
      "activePunctuationOption",
    );
    const storedTimerOption = localStorage.getItem("activeTimerOption");

    // Update state with retrieved active options
    if (storedDurationOption) {
      setActiveDurationOption(parseInt(storedDurationOption));
    }
    if (storedHighlightOption) {
      setActiveHighlightOption(storedHighlightOption);
    }

    if (storedPunctuationOption) {
      setActivePunctuationOption(storedPunctuationOption === "true");
    }
    if (storedTimerOption) {
      setActiveTimerOption(storedTimerOption === "true");
    }

    fetchParagraph();
  }, []);

  // Start timer when user begins typing
  useEffect(() => {
    let interval: any;
    if (isTyping && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setIsTyping(false);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isTyping, timeLeft]);

  // Submits results to server if results are valid;
  useEffect(() => {
    if (WPM !== 0 && CPM !== 0 && accuracy !== null) {
      if (!isLoggedIn) {
        return;
      }
      submitUserResults();
    }
  }, [WPM, CPM, accuracy]);

  // Handles rendering of next sentence and keeps track of mistakes;
  useEffect(() => {
    if (sentences.length) {
      if (userInput.length === sentences[sentenceIndex].length) {
        const incorrectChars = document.querySelectorAll(".incorrect");
        setMistakes((prevMistakes) => prevMistakes + incorrectChars.length);
        nextSentence();
      }
    }
  }, [userInput]);

  // Handles game ending functionality when timer runs out;
  useEffect(() => {
    // if timer runs out
    if (timeLeft === 0 && !isTyping) {
      const incorrectChars = document.querySelectorAll(".incorrect");
      setMistakes((prevMistakes) => prevMistakes + incorrectChars.length);
      endTest();
      resetTest();
    }
  }, [timeLeft, isTyping]);

  useEffect(() => {
    setTimeLeft(activeDurationOption);
  }, [activeDurationOption]);

  if (isLoading) {
    return <LoadingModal />;
  }
  return (
    <div id="page--test" role="test-page">
      {isMobile && <MobileError />}
      <div className="cont--paragraph" tabIndex={-1}>
        {!isParagraphLoading && sentences[sentenceIndex] ? (
          <p className="paragraph" role="paragraph">
            {sentences[sentenceIndex].split("").map(renderCharacter)}{" "}
            <span role="second-sentence" className="second-sentence">
              {sentences && sentences[sentenceIndex + 1]}&nbsp;
              {/* Append space */}
            </span>
          </p>
        ) : (
          <div className="loading-paragraph">
            <Loader />
          </div>
        )}
      </div>

      <div className="top-row">
        {!isTyping ? (
          <button
            role="start-test"
            className="btn-start-test"
            data-testid="start-test"
            onClick={startTest}
            tabIndex={0}
          >
            Start Test
          </button>
        ) : null}

        {activeTimerOption && (
          <p role="timer" className="timer">
            {timeLeft}
          </p>
        )}
        <button
          role="reset-test"
          className="btn-reset-test"
          onClick={() => resetTest()}
        >
          Reset
        </button>
      </div>

      <div className="stats-and-settings">
        {isTyping && (
          <div role="reset-test-modal" className="modal">
            Press <span> Enter </span> to reset test
          </div>
        )}
        <ul className="cont--results">
          <li className="results-row">
            WPM <span>{WPM ? WPM : "-"}</span>
          </li>
          <li className="results-row">
            CPM <span>{CPM ? CPM : "-"}</span>
          </li>
          <li className="results-row">
            Accuracy <span>{accuracy ? `${accuracy}%` : "-"}</span>
          </li>
          <li className="results-row">
            Mistakes <span>{mistakes && !isTyping ? `${mistakes}` : "-"}</span>
          </li>
        </ul>

        <ul className="cont--settings">
          <li className="settings-row">
            <p className="settings-heading">Test Duration</p>
            <span
              className={
                activeDurationOption === 30 ? "option active" : "option"
              }
              onClick={() => handleDurationOptionClick(30)}
              tabIndex={0}
            >
              30{" "}
            </span>
            <span
              className={
                activeDurationOption === 60 ? "option active" : "option"
              }
              onClick={() => handleDurationOptionClick(60)}
              tabIndex={0}
            >
              60
            </span>
            <span
              className={
                activeDurationOption === 90 ? "option active" : "option"
              }
              onClick={() => handleDurationOptionClick(90)}
              tabIndex={0}
              role="settings-option-duration"
            >
              90
            </span>
            <span
              className={
                activeDurationOption === 120 ? "option active" : "option"
              }
              onClick={() => handleDurationOptionClick(120)}
              tabIndex={0}
            >
              120
            </span>
          </li>

          <li className="settings-row">
            <p className="settings-heading">Highlight Style</p>
            <span
              className={
                activeHighlightOption === "Character"
                  ? "option active"
                  : "option"
              }
              onClick={() => handleHighlightOptionClick("Character")}
              tabIndex={0}
            >
              Character
            </span>
            <span
              className={
                activeHighlightOption === "Caret" ? "option active" : "option"
              }
              onClick={() => handleHighlightOptionClick("Caret")}
              tabIndex={0}
            >
              Caret
            </span>
          </li>

          <li className="settings-row">
            <p className="settings-heading">Punctuation</p>
            <span
              className={activePunctuationOption ? "option active" : "option"}
              onClick={() => handlePunctuationOptionClick(true)}
              tabIndex={0}
            >
              On
            </span>
            <span
              className={!activePunctuationOption ? "option active" : "option"}
              onClick={() => handlePunctuationOptionClick(false)}
              tabIndex={0}
            >
              Off
            </span>
          </li>

          <li className="settings-row">
            <p className="settings-heading">Show Timer</p>
            <span
              className={activeTimerOption ? "option active" : "option"}
              onClick={() => handleTimerOptionClick(true)}
              tabIndex={0}
            >
              Show
            </span>
            <span
              role="settings-option-timer"
              className={!activeTimerOption ? "option active" : "option"}
              onClick={() => handleTimerOptionClick(false)}
              tabIndex={0}
            >
              Hide
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Test;
