import { FormEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginApi } from "../lib/api";

type Props = {
  open: boolean;
};

export default function LoginModal({ open }: Props) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const data = await loginApi(username);
      login(username.trim(), data.token);
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-99999 flex items-center justify-center
      transition-all duration-300 ease-out bg-yellow-500
      ${open ? "visible" : "invisible"}`}
    >
      <div
        className={`
          w-[90%] max-w-sm
          rounded-3xl
          bg-linear-to-b from-[#1c2e4a] to-[#0f1b2e]
          border-[3px] border-[#5fa3c7]
          shadow-[0_12px_40px_rgba(0,0,0,0.7)]
          p-5 text-white
          transform transition-all duration-300
          ${open ? "scale-100 opacity-100" : "scale-90 opacity-0"}
        `}
      >
        {/* Title */}
        <h2 className="text-center text-xl font-extrabold tracking-wide drop-shadow">
          Welcome, Captain ☠️
        </h2>
        <p className="mt-1 text-center text-sm text-slate-300">
          Enter your pirate name to begin.
        </p>

        {/* Input */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            ref={inputRef}
            className="
              w-full rounded-xl
              border-[3px] border-[#5fa3c7]
              bg-[#16263d]
              px-4 py-3 text-sm text-white
              outline-none
              shadow-inner
              focus:ring-2 focus:ring-[#5fa3c7]
            "
            placeholder="Captain name..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {error && <p className="text-center text-xs text-red-400">{error}</p>}

          {/* Game-style button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full rounded-xl
              bg-linear-to-b from-[#54e39d] to-[#2fbf71]
              border-[3px] border-[#1e8f55]
              py-3 text-sm font-extrabold text-[#063b1d]
              shadow-[0_6px_0_#1e8f55]
              transition
              active:translate-y-[3px]
              active:shadow-none
              disabled:opacity-60
              cursor-pointer
            "
          >
            {loading ? "Entering..." : "Start Adventure"}
          </button>
        </form>
      </div>
    </div>
  );
}
