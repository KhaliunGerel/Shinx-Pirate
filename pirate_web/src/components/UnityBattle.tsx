/* eslint-disable react-hooks/exhaustive-deps */
import { Unity, useUnityContext } from "react-unity-webgl";
import Logo from "../assets/icon.png";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import BuyCoinsModal from "./BuyCoinModal";
import { finishGame } from "../lib/api";

export default function UnityBattle() {
  const { updatedBalance, balance, setBalance } = useAuth();
  const [openBuyModal, setOpenBuyModal] = useState(false);

  const { unityProvider, isLoaded, loadingProgression, sendMessage } =
    useUnityContext({
      loaderUrl: "/unity/Build/web.loader.js",
      dataUrl: "/unity/Build/web.data",
      frameworkUrl: "/unity/Build/web.framework.js",
      codeUrl: "/unity/Build/web.wasm",
    });

  const onFinishGame = async (coin: number, record: number) => {
    try {
      const res = await finishGame(coin, record);
      console.log(res);
      setBalance(coin);
    } catch (err) {
      console.error("Balance fetch failed", err);
    }
  };

  useEffect(() => {
    if (!isLoaded || balance === null || updatedBalance === null) return;

    let attempts = 0;

    const trySendCoin = () => {
      try {
        sendMessage("Main Camera", "SetCoinFromReact", String(balance));
      } catch (err) {
        attempts++;

        if (attempts < 10) {
          setTimeout(trySendCoin, 500);
        } else {
          console.error("Failed to find GameController after 10 attempts", err);
        }
      }
    };

    setTimeout(trySendCoin, 800);
  }, [isLoaded, updatedBalance, sendMessage]);

  useEffect(() => {
    const handler = (event: any) => {
      const { action, payload } = event.detail;

      if (action === "OPEN_BUY_COIN_POPUP") {
        setOpenBuyModal(true);
      }
      if (action === "GAME_OVER") {
        console.log(payload);
        const data = JSON.parse(payload);
        onFinishGame(data.coin, data.distance);
      }
    };

    window.addEventListener("UNITY_TO_REACT", handler);
    return () => window.removeEventListener("UNITY_TO_REACT", handler);
  }, []);

  return (
    <>
      <div
        className="w-full h-full touch-none overflow-hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {!isLoaded && (
          <div
            style={{
              fontFamily: "system-ui",
            }}
            className="h-full w-full flex justify-center items-center flex-col gap-4"
          >
            <img src={Logo} className="h-24 w-24" />
            {Math.round(loadingProgression * 100)}%
          </div>
        )}

        <Unity unityProvider={unityProvider} className="w-full h-full" />
      </div>

      <BuyCoinsModal
        open={openBuyModal}
        onClose={() => setOpenBuyModal(false)}
      />
    </>
  );
}
