const QuestionnaireForm = ({ quizName, setQuizName, questionDescription, setQuestionDescription }) => {
  return (
    <>
      <div>
        <label htmlFor="quizName" className="block mb-2">Quiz name:</label>
        <input
          id="quizName"
          type="text"
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
          className="p-1 border rounded w-full bg-white"
        />
      </div>
      <div>
        <label htmlFor="questionDescription" className="block mb-2">Quiz description:</label>
        <textarea
          id="questionDescription"
          value={questionDescription}
          onChange={(e) => setQuestionDescription(e.target.value)}
          className="p-1 border rounded w-full bg-white h-24"
        />
      </div>
    </>
  );
};

export default QuestionnaireForm;
