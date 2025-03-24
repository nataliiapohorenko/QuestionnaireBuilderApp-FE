import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useQuestionnaireService from "../services/QuestionnaireService";
import QuestionnaireForm from "../components/QuestionnaireForm";
import QuestionList from "../components/QuestionList";
import BackButton from "../components/BackButton";

const QuestionnaireBuilder = () => {
  const [questions, setQuestions] = useState([]);
  const [quizName, setQuizName] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const { createNewQuestionnaire, getQuestionnaireById, updateQuestionnaire } = useQuestionnaireService();

  useEffect(() => {
    if (id) {
      getQuestionnaireById(id)
        .then((data) => {
          setQuizName(data.name);
          setQuestionDescription(data.description);
          setQuestions(
            data.questions.map((q) => ({
              id: q._id,
              text: q.text,
              type: q.type,
              options: q.options.map((opt) => ({
                id: opt._id || Date.now() + Math.random(),
                text: opt.text || opt,
              })),
            }))
          );
        })
        .catch((error) => {
          console.error("Error loading quiz:", error);
          setErrorMessage("Failed to load quiz.");
        });
    }
  }, [id]);

  const validateForm = () => {
    if (!quizName.trim()) {
      setErrorMessage("Quiz name shouldn't be empty.");
      return false;
    }
    if (!questionDescription.trim()) {
      setErrorMessage("Quiz description shouldn't be empty.");
      return false;
    }
    if (questions.length === 0) {
      setErrorMessage("Quiz should contain at least 1 question.");
      return false;
    }

    for (const question of questions) {
      if (!question.text.trim()) {
        setErrorMessage("Every question should be named.");
        return false;
      }

      if (
        (question.type === "single" || question.type === "multiple") &&
        question.options.length < 2
      ) {
        setErrorMessage("Questions type Single choice or Multiple choices should have at least 2 answers.");
        return false;
      }

      if (question.options.some((opt) => !opt.text.trim())) {
        setErrorMessage("Answers could't be empty.");
        return false;
      }
    }

    setErrorMessage("");
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const formattedQuiz = {
      name: quizName,
      description: questionDescription,
      questions: questions.map((q) => ({
        _id: q.id,
        text: q.text,
        type: q.type,
        options: q.type === "text" ? [] : q.type === "image" ? [] : q.options.map((opt) => opt.text),
      })),
    };
    const saveQuiz = id ? updateQuestionnaire(id, formattedQuiz) : createNewQuestionnaire(formattedQuiz);
    saveQuiz
      .then(() => navigate("/"))
      .catch((error) => {
        console.error("Error saving quiz:", error);
        setErrorMessage("Failed to save quiz. Please try again.");
      });
  };

  return (
    <>
      <BackButton/>
      <div className="max-w-2xl mx-auto mt-4 mb-8 p-5 bg-white shadow-md rounded-md">
        <h2 className="text-xl font-semibold mb-4">{id ? "Edit Quiz" : "Create Quiz"}</h2>

        <QuestionnaireForm
          quizName={quizName}
          setQuizName={setQuizName}
          questionDescription={questionDescription}
          setQuestionDescription={setQuestionDescription}
        />

        <QuestionList questions={questions} setQuestions={setQuestions} />

        <div className="relative flex justify-between">
          <button onClick={() => setQuestions([...questions, { id: Date.now(), text: "", type: "text", options: [] }])}
            className="mt-4 px-3 py-2 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600">
            Add question
          </button>
          <button onClick={handleSubmit}
            className="mt-4 ml-3 px-3 py-2 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700">
            Save
          </button>
          {errorMessage && (
            <div className="absolute -bottom-4 right-2 text-xs text-red-500">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QuestionnaireBuilder;
