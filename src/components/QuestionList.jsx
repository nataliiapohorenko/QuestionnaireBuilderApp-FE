import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";

const SortableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 text-gray-400 hover:text-black cursor-grab"
        title="Drag"
      >
        ☰
      </div>
      <div className="ml-6">{children}</div>
    </div>
  );
};

const QuestionList = ({ questions, setQuestions }) => {
  const sensors = useSensors(useSensor(PointerSensor));
  const questionIds = useMemo(() => questions.map((q) => q.id), [questions]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);
      setQuestions(arrayMove(questions, oldIndex, newIndex));
    }
  };

  const handleOptionDragEnd = (questionId, event) => {
    const { active, over } = event;
    if (active.id === over?.id) return;

    const question = questions.find((q) => q.id === questionId);
    const oldIndex = question.options.findIndex((o) => o.id === active.id);
    const newIndex = question.options.findIndex((o) => o.id === over.id);

    const updated = questions.map((q) =>
      q.id === questionId
        ? { ...q, options: arrayMove(q.options, oldIndex, newIndex) }
        : q
    );
    setQuestions(updated);
  };

  const updateQuestionText = (id, newText) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, text: newText } : q)));
  };

  const updateQuestionType = (id, newType) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, type: newType, options: newType === "text" ? [] : q.options } : q
      )
    );
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const addOption = (questionId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, options: [...q.options, { id: Date.now(), text: "" }] } : q
      )
    );
  };

  const updateOptionText = (questionId, optionId, newText) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt) =>
                opt.id === optionId ? { ...opt, text: newText } : opt
              ),
            }
          : q
      )
    );
  };

  const removeOption = (questionId, optionId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.filter((opt) => opt.id !== optionId) } : q
      )
    );
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={questionIds} strategy={verticalListSortingStrategy}>
        {questions.map((q, index) => (
          <SortableItem key={q.id} id={q.id}>
            <div className="mb-4 p-3 border border-green-600 rounded-sm bg-green-100">
              <label htmlFor={`question${index}`} className="block mb-2">
                {index + 1}. Question:
              </label>
              <div className="flex justify-between items-center">
                <input
                  id={`question${index}`}
                  type="text"
                  value={q.text}
                  onChange={(e) => updateQuestionText(q.id, e.target.value)}
                  className="mx-2 p-1 border rounded w-full bg-white"
                />
                <select
                  value={q.type}
                  onChange={(e) => updateQuestionType(q.id, e.target.value)}
                  className="p-1 border rounded bg-white"
                >
                  <option value="text">Text</option>
                  <option value="single">Single choice</option>
                  <option value="multiple">Multiple choices</option>
                  <option value="image">Image Upload</option>
                </select>
                <button
                  onClick={() => removeQuestion(q.id)}
                  className="ml-2 p-1 bg-red-400 text-white rounded cursor-pointer hover:bg-red-500"
                >
                  Remove
                </button>
              </div>

              {(q.type === "single" || q.type === "multiple") && (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(e) => handleOptionDragEnd(q.id, e)}
                >
                  <SortableContext
                    items={q.options.map((o) => o.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="mt-3">
                      <p className="text-sm font-semibold">Answers</p>
                      {q.options.map((opt, idx) => (
                        <SortableItem key={opt.id} id={opt.id}>
                          <div className="flex items-center mt-1">
                            <span className="text-xs mr-2">{idx + 1}.</span>
                            <input
                              type="text"
                              value={opt.text}
                              onChange={(e) =>
                                updateOptionText(q.id, opt.id, e.target.value)
                              }
                              className="p-1 border rounded w-full bg-white"
                            />
                            <button
                              onClick={() => removeOption(q.id, opt.id)}
                              className="ml-2 p-1 bg-red-400 text-white rounded cursor-pointer hover:bg-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        </SortableItem>
                      ))}
                      <button
                        onClick={() => addOption(q.id)}
                        className="mt-2 px-2 py-1 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600"
                      >
                        Add answer
                      </button>
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default QuestionList;
