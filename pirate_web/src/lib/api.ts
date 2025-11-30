export async function getDepositAddress() {
  const token = localStorage.getItem("game_jwt_token");

  const res = await fetch(
    "https://backend-q2gr.onrender.com/payment/deposit-address",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to get deposit address");
  return res.json();
}

export async function getBalance() {
  const token = localStorage.getItem("game_jwt_token");

  const res = await fetch("https://backend-q2gr.onrender.com/payment/balance", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch balance");
  return res.json();
}

export async function finishGame(gameCoinsEarned: number, record: number) {
  const token = localStorage.getItem("game_jwt_token");

  const res = await fetch("https://backend-q2gr.onrender.com/game/finish", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ gameCoinsEarned, record }),
  });

  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export async function loginApi(username: string) {
  const res = await fetch("https://backend-q2gr.onrender.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });

  if (!res.ok) throw new Error("Login failed");

  return res.json();
}
