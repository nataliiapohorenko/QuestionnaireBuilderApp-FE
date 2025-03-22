import { useState, useEffect, useRef, useCallback } from "react";
import ContextMenu from "./ContextMenu";
import useQuestionnaireService from "../services/QuestionnaireService";
import { useNavigate } from "react-router-dom";

const QuestionnaireList = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [totalPages, setTotalPages] = useState(1);
  const [loadMoreMode, setLoadMoreMode] = useState(false);
  const quizzesPerPage = 6;
  const loadMoreRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { getPaginatedQuestionnaires, deleteQuestionnaire } = useQuestionnaireService();
  const navigate = useNavigate();

  const loadPage = async (page, replace = false) => {
    try {
      const res = await getPaginatedQuestionnaires(page, quizzesPerPage, sortBy);
      if (replace) {
        setQuestionnaires(res.questionnaires);
      } else {
        setQuestionnaires((prev) => [...prev, ...res.questionnaires]);
      }
      setIsLoaded(true);
      setTotalPages(Math.ceil(res.total / quizzesPerPage));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setLoadMoreMode(false);
    loadPage(1, true);
  }, [sortBy]);

  useEffect(() => {
    if (!loadMoreMode || currentPage === 1) return;
    loadPage(currentPage);
  }, [currentPage, loadMoreMode]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleMenuToggle = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleEdit = (id) => {
    navigate(`/edit-quiz/${id}`);
  };

  const handleRun = (id) => {
    navigate(`/run-quiz/${id}`);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Видалити опитування: ${name}?`)) {
      deleteQuestionnaire(id)
        .then(() => {
          setQuestionnaires(questionnaires.filter(q => q._id !== id));
        })
        .catch((err) => console.log(err));
    }
  };

  const handleStatistics = (id) => {
    navigate(`/stats-quiz/${id}`);
  };

  const handleLoadMore = () => {
    setLoadMoreMode(true);
  };

  const handleNext = () => {
    setLoadMoreMode(false);
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadPage(nextPage, true);
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      loadPage(prevPage, true);
    }
  };

  const handleObserver = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && loadMoreMode && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [loadMoreMode, currentPage, totalPages]);

  useEffect(() => {
    if (!loadMoreMode) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 1.0 });
    const target = loadMoreRef.current;
    if (target) observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [handleObserver, loadMoreMode]);

  if(!isLoaded) return (<p className="m-auto text-xl">Loading...</p>)

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4 mr-12">
        <label className="mr-2 text-sm font-semibold">Sort by:</label>
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="border p-1 rounded bg-white text-sm"
        >
          <option value="createdAt">Newest</option>
          <option value="name">Name (A-Z)</option>
          <option value="questionsCount">Questions Count</option>
          <option value="completions">Completions</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-3 grid-cols-2 gap-6 justify-items-center">
        {questionnaires.map((q) => (
          <div
            className="relative w-56 h-48 flex flex-col justify-between border rounded-sm p-4 bg-green-100 border-green-600 shadow-lg"
            key={q._id}
          >
            <div>
              <h3 className="text-lg font-semibold">{q.name}</h3>
              <p className="text-sm text-gray-700">{q.description}</p>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-xs">Questions: {q.questionsCount}</p>
              <p className="text-xs">Completions: {q.completions}</p>
            </div>
            <ContextMenu
              isOpen={openMenuId === q._id}
              onToggle={() => handleMenuToggle(q._id)}
              onEdit={() => handleEdit(q._id)}
              onRun={() => handleRun(q._id)}
              onDelete={() => handleDelete(q._id, q.name)}
              onStatistics={() => handleStatistics(q._id)}
            />
          </div>
        ))}
      </div>

      {currentPage === 1 && currentPage < totalPages && (
        <div className="flex justify-center mt-12">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 bg-orange-200 hover:bg-orange-400 rounded font-semibold text-sm"
          >
            Load More
          </button>
        </div>
      )}

      {loadMoreMode && currentPage < totalPages && (
        <div
          ref={loadMoreRef}
          className="h-10 mt-6 flex justify-center items-center text-gray-400"
        >
          Loading...
        </div>
      )}

      {!loadMoreMode && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-1 border rounded bg-gray-100">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionnaireList;