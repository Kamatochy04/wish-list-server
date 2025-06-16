import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventRoutes";
import giftRoutes from "./routes/giftRoutes";
import userRoutes from "./routes/userRoutes";
import publicRoutes from "./routes/publicRoutes";
import { setupSwagger } from "./config/swagger";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/gifts", giftRoutes);
app.use("/users", userRoutes);
app.use("/public", publicRoutes);

setupSwagger(app);

export default app;
