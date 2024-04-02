"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useMyContext } from "@/context";
import LoadingModal from "@/components/loading-modal";
import MobileError from "@/components/mobile-error";

interface User {
  id: number;
  username: string;
  wpm: number;
  cpm: number;
  accuracy: string;
  submission_date: string;
}

const History = () => {
  const { isLoggedIn, userName, setSignUp, isMobile, setIsMobile } =
    useMyContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [sortOption, setSortOption] = useState<string>("submission_date");
  const [userData, setUserData] = useState<User[]>([]);

  useEffect(() => {
    document.title = "Typa | History";
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate} | ${formattedTime}`;
  };

  useEffect(() => {
    // Fetch user data from your API and update state
    const fetchUserData = async () => {
      try {
        const response = await fetch("../api/retrieve-user-stats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userName,
          }),
        });
        if (response.ok) {
          const data = await response.json();

          const parsedUserData = data.users.map((user: User) => ({
            ...user,
            submission_date: formatDate(user.submission_date),
          }));
          setUserData(parsedUserData);
        }
      } catch (error: any) {
        console.log("Error fetching user data:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
      }
    };

    fetchUserData();
  }, [userName]); // Empty dependency array ensures this effect runs only once on component mount

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  const sortedUserData = [...userData].sort((a, b) => {
    if (sortOption === "submission_date") {
      // Convert submission_date values to numeric timestamps
      return (
        new Date(b.submission_date).getTime() -
        new Date(a.submission_date).getTime()
      );
    } else {
      // Ensure both values being subtracted are numbers
      const userSortOption = sortOption as keyof User;
      return Number(b[userSortOption]) - Number(a[userSortOption]);
    }
  });

  if (isLoading) {
    return <LoadingModal />;
  }

  return (
    <div role="history-page" id="page--history">
      {isMobile && <MobileError />}
      {!isLoggedIn ? (
        <p role="error-message-history" className="error-message">
          <Link href="/auth" onClick={() => setSignUp(false)}>
            Login
          </Link>{" "}
          to view history
        </p>
      ) : (
        userData && (
          <>
            <label htmlFor="select" className="label--select">
              Sort by:
              <select
                id="select"
                name="select"
                value={sortOption}
                onChange={handleSortChange}
              >
                <option value="wpm">WPM</option>
                <option value="cpm">CPM</option>
                <option value="accuracy">Accuracy</option>
                <option value="submission_date">Submission Date</option>
              </select>
            </label>
            <table role="data-table" className="results-table">
              <thead className="table-head">
                <tr className="row">
                  <th className="heading">#</th>
                  <th className="heading">WPM</th>
                  <th className="heading">CPM</th>
                  <th className="heading">Accuracy</th>
                  <th className="heading">Submission Date</th>
                </tr>
              </thead>
              <tbody className="table-rows">
                {sortedUserData.map((user, index) => (
                  <tr key={user.id} className="row">
                    <td className="node">{index + 1}</td>
                    <td className="node">{user.wpm}</td>
                    <td className="node">{user.cpm}</td>
                    <td className="node">{user.accuracy}</td>
                    <td className="node">{user.submission_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )
      )}
    </div>
  );
};

export default History;
