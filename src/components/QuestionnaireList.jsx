import { useState, useEffect, useRef, useCallback } from "react";
import ContextMenu from "./ContextMenu";
import useQuestionnaireService from "../services/QuestionnaireService";
import { useNavigate } from "react-router-dom";

const QuestionnaireList = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const quizzesPerPage = 6;

  const loadMoreRef = useRef(null);

  const { getPaginatedQuestionnaires, deleteQuestionnaire } = useQuestionnaireService();
  const navigate = useNavigate();

  const loadPage = async (pageNum) => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const res = await getPaginatedQuestionnaires(pageNum, quizzesPerPage, sortBy);
      setIsLoaded(true);
      if (res.questionnaires.length === 0) {
        setHasMore(false);
      } else {
        setQuestionnaires((prev) => [...prev, ...res.questionnaires]);
        setPage((prev) => prev + 1);
        const totalPages = Math.ceil(res.total / quizzesPerPage);
        if (pageNum >= totalPages) setHasMore(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setQuestionnaires([]);
    setPage(1);
    setHasMore(true);
    loadPage(1);
  }, [sortBy]);

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

  const handleObserver = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !isLoading) {
      loadPage(page);
    }
  }, [hasMore, isLoading, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 1.0 });
    const target = loadMoreRef.current;
    if (target) observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [handleObserver]);

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

      <div ref={loadMoreRef} className="h-12 mt-6 flex justify-center items-center">
        {isLoading && <span className="animate-pulse text-gray-500">Loading more...</span>}
        {!hasMore && questionnaires.length > 0 && (
          <span className="text-gray-400 text-sm">No more questionnaires</span>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireList;