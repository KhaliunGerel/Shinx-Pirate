/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { getDepositAddress, getBalance } from "../lib/api";
import classNames from "classnames";
import { useAuth } from "../context/AuthContext";
import Lottie from "lottie-react";
import splashAnim from "../assets/success.json";

interface BuyCoinsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function BuyCoinsModal({ open, onClose }: BuyCoinsModalProps) {
  const { balance, setBalance, setUpdatedBalance } = useAuth();
  const [address, setAddress] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const prevRef = useRef<number | null>(null);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    if (!open) {
      setWaiting(false);
      return;
    }

    getDepositAddress().then((res) => {
      setAddress(res.address);
    });
  }, [open]);

  useEffect(() => {
    if (!waiting || !open) return;

    const interval = setInterval(async () => {
      try {
        const res = await getBalance();
        setBalance(res.game_coin);
        await delay(200);
        setUpdatedBalance(Date.now());
      } catch (err) {
        console.error("Balance fetch failed", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [waiting, open, setBalance, setUpdatedBalance]);

  useEffect(() => {
    if (prevRef.current !== null) {
      const diff = (balance || 0) - prevRef.current;

      if (Math.abs(diff) === 10 && waiting) {
        setShowSuccess(true);
        const interval = setInterval(async () => {
          setShowSuccess(false);
        }, 700);

        return () => clearInterval(interval);
      }
    }

    prevRef.current = balance;
  }, [balance, waiting]);

  function handleCopy() {
    navigator.clipboard.writeText(address);
    setToast("🏴‍☠️ Address copied to clipboard!");

    setTimeout(() => {
      setToast(null);
    }, 2000);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={classNames(
          "relative w-[92%] max-w-sm rounded-2xl border-4 border-[#6fb1e5]",
          "bg-linear-to-b from-[#15263f] to-[#0b1628]",
          "p-5 text-white shadow-2xl",
          "animate-[modalIn_0.25s_ease-out]"
        )}
      >
        <div className="text-center mb-4">
          <h2 className="text-xl font-extrabold tracking-wide">
            ⚔️ Buy Game Coins
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Send ETH to your pirate vault
          </p>
        </div>

        {address && (
          <div className="flex justify-center bg-white p-3 rounded-lg">
            <QRCode value={address} size={140} />
          </div>
        )}

        <div className="mt-3 bg-black/70 p-2 rounded text-xs break-all text-center">
          {address}
        </div>

        <button
          onClick={handleCopy}
          className="mt-3 w-full rounded-xl
              bg-linear-to-b from-[#54e39d] to-[#2fbf71]
              border-[3px] border-[#1e8f55]
              py-2 text-sm font-extrabold text-[#063b1d]
              shadow-[0_6px_0_#1e8f55]
              transition
              active:translate-y-[3px]
              active:shadow-none
              disabled:opacity-60
              cursor-pointer"
        >
          Copy Address
        </button>

        <button
          onClick={() => setWaiting(true)}
          className="mt-3 w-full rounded-xl
              bg-linear-to-b from-[#547fe3] to-[#547fe3]
              border-[3px] border-[#254eaf]
              py-2 text-sm font-extrabold text-[#063b1d]
              shadow-[0_6px_0_#1e408f]
              transition
              active:translate-y-[3px]
              active:shadow-none
              disabled:opacity-60
              cursor-pointer"
        >
          I Have Sent ETH
        </button>

        <p className="mt-4 text-xs text-slate-300 text-center">
          Coins are added automatically after confirmation.
        </p>

        <div className="mt-3 text-center text-yellow-300 font-extrabold text-lg">
          💰 Current Coins: {balance}
        </div>

        {showSuccess && (
          <Lottie
            animationData={splashAnim}
            loop={false}
            className="-mt-48 absolute z-10"
          />
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-xl
              bg-linear-to-b from-[#d13737] to-[#d82b2b]
              border-[3px] border-[#7c1313]
              py-2 text-sm font-extrabold text-white
              shadow-[0_6px_0_#7c1313]
              transition
              active:translate-y-[3px]
              active:shadow-none
              disabled:opacity-60
              cursor-pointer z-50"
        >
          Close
        </button>
      </div>

      <style>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>

      <style>{`
        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      {toast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2">
          <div className="bg-black/90 text-white px-4 py-2 rounded-full text-center text-sm font-bold shadow-xl border-3 border-emerald-400 animate-[toastIn_0.25s_ease-out]">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
