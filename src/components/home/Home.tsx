import { useEffect, useState } from "react";
import { Button } from "@quarkd/quark-react";

import axios from "axios";
import "./home.scss";

const fetchQuestionData = async () => {
    const result = await axios.get(
        "https://apiofentrancequestion.entrancequestion.com"
    );
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

const Home = ({ themeMode }: any) => {
    const [modelQuestion, setModelQuestion] = useState<any>({});
    const [statusMessage, setStatusMessage] = useState<string>("empty");
    const [feedbackMessage, setFeedbackMessage] = useState<string>("empty");
    const [newQuestion, setNewQuestion] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [nextButtonContent, setNextButtonContent] = useState("Next question");

    const [styleClass_message, setStyleClass_message] = useState("hidden");
    const [styleClass_modelData, setStyleClass_modelData] = useState("hidden");
    const [styleClass_reveal, setStyleClass_reveal] = useState("hidden");
    const [style_status, setStyle_status] = useState({});
    const [option__item1, setOption__item1] = useState("option__item");
    const [option__item2, setOption__item2] = useState("option__item");
    const [option__item3, setOption__item3] = useState("option__item");
    const [option__item4, setOption__item4] = useState("option__item");

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
    };

    const checkUserAnswer = (opt: number) => {
        setStyleClass_message("visible");
        // if answer is correct
        if (modelQuestion.correct_option === opt) {
            setStyle_status({ color: "green" });
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
        setOption__item1("option__item");
        setOption__item2("option__item");
        setOption__item3("option__item");
        setOption__item4("option__item");
    };

    const getNewQuestion = () => {
        setNewQuestion(!newQuestion);
    };

    const operationLocalStorage = async () => {
        const savedModelQuestions = await cacheModelQuestions("get");
        if (savedModelQuestions && savedModelQuestions.length > 0) {
            setModelQuestion(savedModelQuestions[0]);
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
        const qLen = savedModelQuestions ? savedModelQuestions.length : 0;
        if (qLen < 1) {
            try {
                await fetchQuestionData().then((result) => {
                    cacheModelQuestions("save", result);
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
                <div
                    className={option__item1}
                    onClick={() => checkUserAnswer(1)}
                >
                    <div className="select__answer"> </div>
                    <div className="answer">{modelQuestion.option_1}</div>
                </div>
                <div
                    className={option__item2}
                    onClick={() => checkUserAnswer(2)}
                >
                    <div className="select__answer"> </div>
                    <div className="answer">{modelQuestion.option_2}</div>
                </div>
                <div
                    className={option__item3}
                    onClick={() => checkUserAnswer(3)}
                >
                    <div className="select__answer"> </div>
                    <div className="answer">{modelQuestion.option_3}</div>
                </div>
                <div
                    className={option__item4}
                    onClick={() => checkUserAnswer(4)}
                >
                    <div className="select__answer"> </div>
                    <div className="answer">{modelQuestion.option_4}</div>
                </div>
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
