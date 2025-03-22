import { useNavigate } from "react-router-dom";
import QuestionnaireList from "../components/QuestionnaireList";

const Home = () => {
  const navigate = useNavigate();

  const handleCreateQuestionnaire = () => {
    navigate("create-quiz");
  };
  return (
    <div className="w-3/4 m-auto p-8">
      <div className="flex justify-between">
        <h1 className="font-bold">Quiz Catalog</h1>
        <button 
          onClick={handleCreateQuestionnaire}
          className="bg-orange-200 hover:bg-orange-400 text-sm font-bold py-1 px-2 rounded"
        >
          Create Quiz
        </button>
      </div>
      <QuestionnaireList />
    </div>
  );
};

export default Home;
