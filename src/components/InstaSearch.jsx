import "./InstaSearch.css";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import GoogleIcon from "@mui/icons-material/Google";
import YouTubeIcon from "@mui/icons-material/YouTube";
import SendIcon from "@mui/icons-material/Send";
import Quiz from "react-quiz-component";

function InstaSearch({ searchResultsWeb, searchResultsYT, quizContent }) {
  const [value, setValue] = useState(0);

  return (
    <div id="insta-search" className="glass">
      <main className="glass">
        <ul id="search-results">
          {searchResultsWeb && searchResultsWeb.length > 0 && value == 0 ? (
            searchResultsWeb.map((r) => {
              return (
                <li>
                  <div className="card glass">
                    <div className="row">
                      <img className="favicon" src={r.favicon} />
                      <div className="col">
                        <p className="title">{r.title}</p>
                        <p className="displayLink">
                          <a href={r.link} target="_blank">
                            {r.displayLink}
                          </a>
                        </p>
                        <p className="desc">{r.snippet}</p>
                        {/* {r.image? (<img src={r.image} className="image"/>): ""} */}
                      </div>
                      <SendIcon />
                    </div>
                  </div>
                </li>
              );
            })
          ) : searchResultsYT && searchResultsYT.length > 0 && quizContent.length > 0 && value == 1 ? (
            searchResultsYT.map((r) => {
              let quizData = quizContent.filter(q => q.id == r.id)[0];
              console.log(quizData)

              let quiz = (quizData)? {
                nrOfQuestions: "1",
                questions: [
                  {
                    question: quizData?.question,
                    questionType: "text",
                    answerSelectionType: "single",
                    answers: [...quizData?.options],
                    correctAnswer: quizData?.key.toString(),
                    messageForCorrectAnswer: "Correct answer. Good job.",
                    messageForIncorrectAnswer:
                      "Incorrect answer. Please try again.",
                    point: "10",
                  },
                ],
              }: null;
              return (
                <li key={r.id}>
                  <div className="YT-card glass">
                    <iframe
                      width="560"
                      height="315"
                      src={"https://www.youtube.com/embed/" + r.id}
                      title="YouTube video player"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen="true"
                      style={{
                        borderRadius: "16px",
                      }}
                    ></iframe>
                    {quizData? <Quiz quiz={quiz} continueTillCorrect={true} shuffleAnswer={true} />: ""}
                  </div>
                </li>
              );
            })
          ) : (
            <Box sx={{ width: "100%", height: "30%" }}>
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
            </Box>
          )}
        </ul>
      </main>
      <footer>
        <Paper
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
          elevation={3}
        >
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction label="Google" icon={<GoogleIcon />} />
            <BottomNavigationAction label="YouTube" icon={<YouTubeIcon />} />
          </BottomNavigation>
        </Paper>
      </footer>
    </div>
  );
}

export default InstaSearch;
