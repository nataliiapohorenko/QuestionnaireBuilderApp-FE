import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import useQuestionnaireService from "../services/QuestionnaireService";
import BackButton from "../components/BackButton";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c"];

const StatisticsPage = () => {
  const { id } = useParams();
  const { getStatistics } = useQuestionnaireService();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    console.log(id);
    getStatistics(id).then(setStats).catch(console.error);
  }, [id]);

  if (!stats) return <p className="text-center mt-10">Loading statistics...</p>;
  if (!stats.avgTime) return (
    <>
      <BackButton/>
      <p className="text-center mt-10">No completions yet</p>
    </>
  );

  const completionsData = Object.entries(stats.completions).map(([date, count]) => ({
    date,
    count,
  }));

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <BackButton/>
      <h2 className="text-2xl font-bold mt-10 mb-4">Statistics</h2>

      <p className="mb-6 text-lg">🕒 Average completion time: <strong>{stats.avgTime} seconds</strong></p>

      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-2">📈 Completions by date</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={completionsData}>
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">📊 Answers Distribution</h3>
        {stats.piecharts.map((q, i) => (
          <div key={i} className="mb-8">
            <p className="font-medium mb-2">{q.question}</p>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={q.data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {q.data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsPage;
