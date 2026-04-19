import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

import Dashboard from "./pages/dashboard";
import Timer from "./components/timer";
import Login from "./pages/Login";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>FocusFlow 🚀</h1>

      {user ? (
        <>
          <button onClick={handleLogout}>Logout</button>
          <Timer />
          <Dashboard />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;