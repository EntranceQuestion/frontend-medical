import { useEffect, useState } from "react";
import { Button } from "@quarkd/quark-react";

import axios from "axios";
import "./home.scss";

const randoUniqueList = () => {
    // get unique and random list from 1 to 4 of length 4
    let loop = true;
    let randomArrayList: number[] = [];
    let count = 0;
    let min = Math.ceil(1);
    let max = Math.floor(4);
    while (loop) {
        let result = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!randomArrayList.includes(result)) {
            count = count + 1;
            if (count === 4) {
                loop = false;
            }
            randomArrayList.push(result);
        }
    }
    return randomArrayList;
};

const fetchQuestionData = async (qIDs?: any) => {
    const url = "https://apiofentrancequestion.entrancequestion.com"
    // const url = "http://127.0.0.1:8000/"

    // using POST method instead of get to keep record of solved questions
    // const result = await axios.get(url);

    // console.log("----------- submit ids ------------");
    // console.log(qIDs)
    // console.log("-------------------------------------");

    // const data = new FormData();
    // data.append("solved_question_ids", qIDs);

    const result = await axios({
        method: "post",
        url: url,
        data:  qIDs,
    });

    return result.data;
};

const cacheModelQuestions = (type: string, value?: any) => {
    if (type === "save") {
        const jsonValue = JSON.stringify(value);
        localStorage.setItem("model_questions", jsonValue);
    }
    if (type === "get") {
        const savedModelQuestions: any =
            localStorage.getItem("model_questions");
        return JSON.parse(savedModelQuestions);
    }
};

// fuction to remember ids of solved questions
const cacheSolvedQuestionIDs = (value: any) => {
    // console.log("=========================")
    // console.log(value)
    // console.log("=========================")
    const jsonValue = JSON.stringify(value);
    localStorage.setItem("solved_question_ids", jsonValue);
};

const Home = ({ themeMode }: any) => {
    const [modelQuestion, setModelQuestion] = useState<any>({});
    const [statusMessage, setStatusMessage] = useState<string>("empty");
    const [feedbackMessage, setFeedbackMessage] = useState<string>("empty");
    const [newQuestion, setNewQuestion] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [nextButtonContent, setNextButtonContent] = useState("Next question");
    const [options__list, setOptions__list] = useState(randoUniqueList());

    const [styleClass_message, setStyleClass_message] = useState("hidden");
    const [styleClass_modelData, setStyleClass_modelData] = useState("hidden");
    const [styleClass_reveal, setStyleClass_reveal] = useState("hidden");
    const [style_status, setStyle_status] = useState({});
    const [option__item1, setOption__item1] = useState("option__item");
    const [option__item2, setOption__item2] = useState("option__item");
    const [option__item3, setOption__item3] = useState("option__item");
    const [option__item4, setOption__item4] = useState("option__item");
    const [option__disable, setOption__disable] = useState("");

    const revealAnswer = () => {
        const opt = modelQuestion.correct_option;
        if (opt === 1) setOption__item1("option__item correct blink_me");
        if (opt === 2) setOption__item2("option__item correct blink_me");
        if (opt === 3) setOption__item3("option__item correct blink_me");
        if (opt === 4) setOption__item4("option__item correct blink_me");
        setStyleClass_reveal("hidden");
        setStyle_status({
            color: themeMode === "night" ? "#ffffff" : "#666666",
        });
        setStatusMessage("now try next question");
        setFeedbackMessage("...");
        setOption__disable("click__disable");
    };

    // console.log("--------------------------");
    // console.log(localStorage.getItem("model_questions"));
    // console.log("--------------------------");

    const checkUserAnswer = (opt: number) => {
        setStyleClass_message("visible");
        // if answer is correct
        if (modelQuestion.correct_option === opt) {
            setOption__disable("click__disable");
            setStyle_status({ color: "#48b96c" });
            setStatusMessage("correct answer. ");
            setFeedbackMessage("keep it up...");
            setStyleClass_reveal("hidden");
            if (opt === 1) setOption__item1("option__item correct");
            if (opt === 2) setOption__item2("option__item correct");
            if (opt === 3) setOption__item3("option__item correct");
            if (opt === 4) setOption__item4("option__item correct");
        }
        // if answer is incorrect
        else {
            setStyle_status({ color: "rgba(255, 0, 0, 0.6)" });
            setStatusMessage("wrong answer. ");
            setFeedbackMessage("try again...");
            setStyleClass_reveal("visible");
            if (opt === 1) setOption__item1("option__item incorrect");
            if (opt === 2) setOption__item2("option__item incorrect");
            if (opt === 3) setOption__item3("option__item incorrect");
            if (opt === 4) setOption__item4("option__item incorrect");
        }
    };

    const resetStates = () => {
        setStyleClass_reveal("hidden");
        setStyleClass_message("hidden");
        setOption__disable("");
        setOption__item1("option__item");
        setOption__item2("option__item");
        setOption__item3("option__item");
        setOption__item4("option__item");
    };

    const getNewQuestion = () => {
        setOptions__list(randoUniqueList());
        setNewQuestion(!newQuestion);
    };

    const operationLocalStorage = async () => {
        const savedModelQuestions = await cacheModelQuestions("get");
        if (savedModelQuestions && savedModelQuestions.length > 1) {
            setModelQuestion(savedModelQuestions[1]);
            savedModelQuestions.shift();
            cacheModelQuestions("save", savedModelQuestions);
        } else {
            setModelQuestion({
                id: 0,
                question: "opps!! Network Error!!!",
                option_1: "please click on 'New question' button to REFRESH",
                option_2: "please click on 'New question' button to REFRESH",
                option_3: "please click on 'New question' button to REFRESH",
                option_4: "please click on 'New question' button to REFRESH",
                correct_option: 1,
            });
        }
    };
    const fetchIfNeed = async () => {
        const savedModelQuestions: any = await cacheModelQuestions("get");
        const qLen = savedModelQuestions ? savedModelQuestions.length : 1;
        if (qLen < 2) {
            try {
                const solved_question_ids = localStorage.getItem(
                    "solved_question_ids"
                );
                // console.log("----------- solved_question_ids ------------");
                // console.log(solved_question_ids)
                // console.log("-------------------------------------");

                await fetchQuestionData(solved_question_ids).then((result) => {
                    cacheModelQuestions("save", result);
                    cacheSolvedQuestionIDs(result[0]);
                });
            } catch (error) {
                operationLocalStorage();
            }
        }
    };
    useEffect(() => {
        (async () => {
            setNextButtonContent("");
            setIsLoading(true);
            setStyleClass_modelData("hidden");
            await fetchIfNeed();
            await operationLocalStorage();
            setNextButtonContent("Next question");
            setIsLoading(false);
            setStyleClass_modelData("visible");
        })();
        resetStates();
    }, [newQuestion]);

    return (
        <div id="HOME">
            <div className={`question ${styleClass_modelData}`}>
                {modelQuestion.question}
            </div>

            <div className={`option ${styleClass_modelData}`}>
                {options__list.map((option_num) => {
                    //.making options random
                    let option__item = option__item4;
                    let modelQuestionOption = modelQuestion.option_4;
                    if (option_num === 1) {
                        option__item = option__item1;
                        modelQuestionOption = modelQuestion.option_1;
                    }
                    if (option_num === 2) {
                        option__item = option__item2;
                        modelQuestionOption = modelQuestion.option_2;
                    }
                    if (option_num === 3) {
                        option__item = option__item3;
                        modelQuestionOption = modelQuestion.option_3;
                    }
                    return (
                        <div key={option_num.toString()}>
                            <div
                                className={`${option__item} ${option__disable}`}
                                onClick={() => checkUserAnswer(option_num)}
                            >
                                <div className="select__answer"> </div>
                                <div className="answer">
                                    {modelQuestionOption}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={`message ${styleClass_message}`}>
                <span className="msg__status" style={style_status}>
                    {statusMessage}
                </span>
                <span className="msg__feedback">{feedbackMessage}</span>
            </div>
            <div
                className={`reveal ${styleClass_reveal}`}
                onClick={revealAnswer}
            >
                Reveal answer
            </div>

            <Button
                loading={isLoading}
                loadtype="circular"
                loadingcolor="#666666"
                className="next__question"
                onClick={getNewQuestion}
            >
                {nextButtonContent}
            </Button>
        </div>
    );
};

export default Home;
