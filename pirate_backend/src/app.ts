import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes";
import shopRoutes from "./routes/shop.routes";
import gameRoutes from "./routes/game.routes";
import paymentRoutes from "./routes/payment.routes";

// import { errorHandler } from "./middleware/errorMiddleware";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/auth", authRoutes);
app.use("/shop", shopRoutes);
app.use("/game", gameRoutes);
app.use("/payment", paymentRoutes);

// Error handler
// app.use(errorHandler);

export default app;
