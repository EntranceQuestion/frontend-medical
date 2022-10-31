import { useEffect, useState } from "react";
import axios from "axios";
import "./home.scss";

// const modelQuestions = [
//     {
//         id: "1",
//         correctAnswer: 2,
//         question: "What is science?",
//         answer: {
//             option1: "science is Commere",
//             option2: "Science is the body of knowledge",
//             option3: "JM Academy",
//             option4: "Evergreen",
//         },
//     },
//     {
//         id: "2",
//         correctAnswer: 3,
//         question: "where is Nepal Avalance Academy",
//         answer: {
//             option1: "Siraha",
//             option2: "Madar",
//             option3: "Ramaul",
//             option4: "Jaynagar",
//         },
//     },
//     {
//         id: "3",
//         correctAnswer: 1,
//         question: "who is Father of science",
//         answer: {
//             option1: "Albert Einstein",
//             option2: "Newton",
//             option3: "I don't know",
//             option4: "please next question",
//         },
//     },
// ];

// const rnum = (): number => {
//     let randomNum: number = Math.floor(Math.random() * 10);
//     if (randomNum > 2) {
//         return rnum();
//     }
//     return randomNum;
// };

type FetchQuestionType = {
    id: number;
    question: string;
    option_1: string;
    option_2: string;
    option_3: string;
    option_4: string;
    correct_option: number;
};

const Home = ({ themeMode }: any) => {

    const fetchQuestionData = async () => {
        const result = await axios.get(
            "https://apiofentrancequestion.entrancequestion.com"
        );
        return result.data;
    };

    const [modelQuestion, setModelQuestion] = useState<any>({});

    const [statusMessage, setStatusMessage] = useState<string>("empty");
    const [feedbackMessage, setFeedbackMessage] = useState<string>("empty");

    const [styleClass_message, setStyleClass_message] = useState("hidden");
    const [styleClass_reveal, setStyleClass_reveal] = useState("hidden");
    const [style_status, setStyle_status] = useState({});
    const [option__item1, setOption__item1] = useState("option__item");
    const [option__item2, setOption__item2] = useState("option__item");
    const [option__item3, setOption__item3] = useState("option__item");
    const [option__item4, setOption__item4] = useState("option__item");


    const revealAnswer = () => {
        const opt = modelQuestion.correct_option;
        if (opt === 1) setOption__item1("option__item correct");
        if (opt === 2) setOption__item2("option__item correct");
        if (opt === 3) setOption__item3("option__item correct");
        if (opt === 4) setOption__item4("option__item correct");
        setStyleClass_reveal("hidden");
        console.log(themeMode);
        setStyle_status({
            color: themeMode === "night" ? "#ffffff" : "#000000",
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
            setStyle_status({ color: "red" });
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
        fetchQuestionData().then((result) => {
            setModelQuestion(result);
        });
    };

    useEffect(() => {
        fetchQuestionData().then((result) => {
            setModelQuestion(result);
        });
        resetStates();
    }, []);

    return (
        <div id="HOME">
            <div className="question">{modelQuestion.question}</div>

            <div className="option">
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

            <div className="next__question" onClick={getNewQuestion}>
                Next question
            </div>
        </div>
    );
};

export default Home;
