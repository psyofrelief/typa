// app/about/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useMyContext } from "@/context";
import LoadingModal from "@/components/loading-modal";
import MobileError from "@/components/mobile-error";

const About = () => {
  const { isMobile } = useMyContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    document.title = "Typa | About";
  });

  // Hook that removes loading screen after 0.3s;
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  return (
    <div role="about-page" id="page--about">
      {isLoading ? <LoadingModal /> : null}
      {isMobile ? <MobileError /> : null}
      <section className="section-test-info" data-testid="section-test-info">
        <h1 className="section-heading">What does this typing test involve?</h1>
        <p className="section-brief">{`You will have one minute to enter a series of words throughout this typing test. You will obtain the following statistics after finishing the test, which I have broken down:

`}</p>
        <ul className="cont--info">
          <li className="info">
            <span>{`Words per Minute (WPM) -`} </span>
            {`This is the quantity of accurately typed words that are processed in a minute. On the other hand, the value of long and short words is equal. As a result, this is a simpler metric that is used for typing tests.`}
          </li>
          <li className="info">
            <span>{`Characters per Minute (CPM) -`}</span>
            {`This is the quantity of accurately typed characters that are processed in a minute. The word length has an impact on your word per minute (WPM) during a typing test since shorter words are simpler to type correctly. As a result, it's also tested how many characters you can type accurately in a minute.`}
          </li>
          <li className="info">
            <span>{`Accuracy -`}</span>
            {`This is a percentage that is calculated by dividing the total number of characters in all words by the number of successfully written characters. Your accuracy score on this typing test will drop if you make a mistake.`}
          </li>
          <li className="info">
            <span>{`Mistakes -`}</span>
            {`This refers to the number of incorrectly typed characters in words.`}
          </li>
        </ul>
      </section>
      <section className="section-test-info" data-testid="section-test-info">
        <h1 className="section-heading">What is a good typing test score?</h1>
        <p className="section-brief">{`Here's a hint as to where you might be sitting after finishing the typing test:`}</p>
        <ul className="cont--info">
          <li className="info">
            <span>35-40 WPM</span> {`is the typical person's typing speed.`}
          </li>
          <li className="info">
            <span>60-75 WPM</span> places you above average.
          </li>
          <li className="info">
            <span>{`90+ WPM`}</span> indicates that you type really quickly and
            that you might be a touch typist.
          </li>
        </ul>
      </section>
      <section className="section-test-info" data-testid="section-test-info">
        <h1 className="section-heading">{`How can I improve my typing skills?`}</h1>
        <p className="section-brief">{`There are no short cuts when it comes to typing speed; you just need to keep getting better at it. Consequently, daily typing practice will assist you in achieving your objective.`}</p>
        <p className="section-brief">{`However, if touch typing is your objective, there is some muscle memory involved in where your fingers should land on the keyboard.`}</p>
      </section>

      <section className="section-start-test">
        <Link role="test-link" href="/test">
          Click here to begin typing test
        </Link>
      </section>
    </div>
  );
};

export default About;
