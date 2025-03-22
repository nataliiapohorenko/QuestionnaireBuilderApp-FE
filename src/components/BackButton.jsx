import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/");
  };
  return(
    <button onClick={handleNavigate} className="mt-6 ml-8 bg-orange-200 hover:bg-orange-400 text-sm font-bold py-1 px-2 rounded">
      back
    </button>
  )
}

export default BackButton;