import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useQuestionnaireService from "../services/QuestionnaireService";
import BackButton from "../components/BackButton";

const QuizPage = () => {
  const { id } = useParams();
  const { getQuestionnaireById, sendQuizAnswers } = useQuestionnaireService();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeTaken, setTimeTaken] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const localStorageKey = `quiz-${id}-progress`;

  useEffect(() => {
    if (id) {
      getQuestionnaireById(id)
        .then((data) => {
          setQuiz(data);
          const savedState = localStorage.getItem(localStorageKey);
        if (savedState) {
          const { savedAnswers, savedStartTime } = JSON.parse(savedState);
          setAnswers(savedAnswers);
          setStartTime(savedStartTime);
        } else {
          const initialAnswers = {};
          data.questions.forEach((q) => {
            initialAnswers[q._id] = q.type === "multiple" ? [] : "";
          });
          setAnswers(initialAnswers);
          setStartTime(Date.now());
        }
        })
        .catch((error) => console.error("Error loading quiz:", error));
    }
  }, [id]);

  useEffect(() => {
    if (!submitted) {
      const interval = setInterval(() => {
        if (startTime) {
          setTimeTaken(Math.floor((Date.now() - startTime) / 1000));
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, submitted]);

  const handleChange = (questionId, value, isCheckbox) => {
    setAnswers((prevAnswers) => {
      let updatedAnswers;
      if (isCheckbox) {
        const updatedChoices = prevAnswers[questionId].includes(value)
          ? prevAnswers[questionId].filter((v) => v !== value)
          : [...prevAnswers[questionId], value];
        updatedAnswers = { ...prevAnswers, [questionId]: updatedChoices };
      } else {
        updatedAnswers = { ...prevAnswers, [questionId]: value };
      }
      const answersToSave = Object.fromEntries(
        Object.entries(updatedAnswers).filter(([_, val]) => !(val instanceof File))
      );
      if(Object.entries(answersToSave).length>0){
        localStorage.setItem(
          localStorageKey,
          JSON.stringify({
            savedAnswers: answersToSave,
            savedStartTime: startTime,
          })
        );
      }
  
      return updatedAnswers;
    });
  };

  const handleSubmit = () => {
    const formData = new FormData();
    const formattedAnswers = [];
  
    Object.entries(answers).forEach(([questionId, answer]) => {
      if (answer instanceof File) {
        formData.append(questionId, answer);
        formattedAnswers.push({ questionId, answer: "file" });
      } else {
        formattedAnswers.push({ questionId, answer });
      }
    });
  
    formData.append("answers", JSON.stringify(formattedAnswers));
    formData.append("timeTaken", timeTaken);
  
    sendQuizAnswers(id, formData)
      .then(() => {
        localStorage.removeItem(localStorageKey);
        setSubmitted(true);
      })
      .catch((err) => console.error("Error submitting quiz:", err));
  };
  

  if (!quiz) return <p className="text-center">Loading...</p>;

  return (
    <>
      <BackButton />
      <div className="max-w-2xl mx-auto p-5">
        <h2 className="text-xl font-bold mb-4">{quiz.name}</h2>
        <p className="mb-6">{quiz.description}</p>

        {quiz.questions.map((q, index) => (
          <div key={q._id} className="mb-6 p-4 border rounded bg-green-100">
            <p className="font-semibold mb-2">{index + 1}. {q.text}</p>

            {q.type === "text" && (
              <input
                type="text"
                value={answers[q._id] || ""}
                onChange={(e) => handleChange(q._id, e.target.value, false)}
                className="p-2 border rounded w-full bg-white"
                disabled={submitted}
              />
            )}

            {q.type === "single" && (
              q.options.map((option) => (
                <label key={option} className="block">
                  <input
                    type="radio"
                    name={`question-${q._id}`}
                    value={option}
                    checked={answers[q._id] === option}
                    onChange={() => handleChange(q._id, option, false)}
                    className="mr-2"
                    disabled={submitted}
                  />
                  {option}
                </label>
              ))
            )}

            {q.type === "multiple" && (
              q.options.map((option) => (
                <label key={option} className="block">
                  <input
                    type="checkbox"
                    value={option}
                    checked={answers[q._id]?.includes(option)}
                    onChange={() => handleChange(q._id, option, true)}
                    className="mr-2"
                    disabled={submitted}
                  />
                  {option}
                </label>
              ))
            )}

            {q.type === "image" && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleChange(q._id, e.target.files[0], false)}
                  className="p-2 border rounded w-full bg-white"
                  disabled={submitted}
                />
                {answers[q._id] && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(answers[q._id])}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          disabled={submitted}
          className={`px-4 py-2 rounded text-white ${submitted ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
        >
          {submitted ? "Submitted" : "Submit Answers"}
        </button>

        {submitted && (
          <p className="mt-4 text-green-600">Your answers have been submitted. Time taken: {timeTaken} seconds.</p>
        )}
      </div>
    </>
  );
};

export default QuizPage;
