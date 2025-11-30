import app from "./app";
import { config } from "./config/env";
import { startDepositDetector } from "./services/EthListenerService";
import { startConfirmationWorker } from "./workers/confirm.worker";
import { startSweepWorker } from "./workers/sweep.worker";

const PORT = config.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  startDepositDetector();
  startConfirmationWorker();
  startSweepWorker();
});

process.on("SIGTERM", () => {
  console.log("Shutting down workers...");
  process.exit(0);
});
