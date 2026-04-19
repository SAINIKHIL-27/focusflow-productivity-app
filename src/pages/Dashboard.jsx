import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { auth } from "../firebase";
import { query, where } from "firebase/firestore";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [chartData, setChartData] = useState([]);

  // ✅ Fetch data from Firebase
  const fetchSessions = async () => {
  const q = query(
    collection(db, "sessions"),
    where("userId", "==", auth.currentUser.uid)
  );

  const querySnapshot = await getDocs(q);

  const data = querySnapshot.docs.map((doc) => doc.data());

  setSessions(data);

  const grouped = {};

  data.forEach((item) => {
    const date = item.createdAt.toDate().toLocaleDateString();

    if (!grouped[date]) {
      grouped[date] = 0;
    }

    grouped[date] += item.duration;
  });

  const formatted = Object.keys(grouped).map((date) => ({
    date,
    minutes: grouped[date]
  }));

  setChartData(formatted);
};

  useEffect(() => {
    fetchSessions();
  }, []);

  // ✅ Total time
  const totalTime = sessions.reduce(
    (acc, curr) => acc + curr.duration,
    0
  );

  return (
    <div style={{ textAlign: "center" }}>
      <h2>📊 Dashboard</h2>

      <h3>Total Focus Time: {totalTime} mins</h3>
      <h3>Sessions Completed: {sessions.length}</h3>

      {/* ✅ Chart */}
      <LineChart width={400} height={300} data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" />
        <Line type="monotone" dataKey="minutes" />
      </LineChart>
    </div>
  );
}