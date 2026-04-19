import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "../firebase";


export default function Timer() {
  const [seconds, setSeconds] = useState(1500); // 25 mins
  const [isRunning, setIsRunning] = useState(false);
  const [task, setTask] = useState("");

  // ✅ Save session to Firebase
  const saveSession = async () => {
    if (!task) {
      alert("Please enter a task!");
      return;
    }

    try {
      await addDoc(collection(db, "sessions"), {
        task: task,
        duration: 1500,
        createdAt: new Date(),
        userId: auth.currentUser.uid
      });
      alert("Session saved!");
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  useEffect(() => {
    let interval = null;

    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    }

    // ✅ Trigger once when timer ends
    if (seconds === 0 && isRunning) {
      setIsRunning(false);
      saveSession();
    }

    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  // ✅ Format time
  const formatTime = () => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Focus Timer</h2>

      {/* ✅ Task Input */}
      <input
        type="text"
        placeholder="Enter your task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        style={{ padding: "8px", width: "200px", marginBottom: "10px" }}
      />

      {/* ✅ Timer Display */}
      <h1>{formatTime()}</h1>

      {/* ✅ Buttons */}
      <div>
        <button onClick={() => setIsRunning(true)}>Start</button>
        <button onClick={() => setIsRunning(false)}>Pause</button>
        <button
          onClick={() => {
            setSeconds(5);
            setIsRunning(false);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}