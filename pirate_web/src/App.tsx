import { useEffect, useState } from "react";
import LoginModal from "./components/LoginModal";
import UnityBattle from "./components/UnityBattle";
import { useAuth } from "./context/AuthContext";

function App() {
  const { token } = useAuth();
  const isAuthed = !!token;

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpenModal(!isAuthed);
    }, 500);

    return () => clearTimeout(timer);
  }, [isAuthed]);

  return (
    <main className="w-full h-dvh overflow-hidden">
      <div className="w-full h-full relative bg-yellow-500 flex flex-col">
        {isAuthed && <UnityBattle />}
        {!isAuthed && <LoginModal open={openModal} />}
      </div>
    </main>
  );
}

export default App;
