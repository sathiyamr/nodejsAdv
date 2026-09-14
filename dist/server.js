import express, {} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import "./database/index.js";
dotenv.config();
const app = express();
const port = Number(process.env.PORT ?? 5000);
app.use(cors({
    origin: process.env.CORS_URL ?? "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
    res.json({ message: "API is running" });
});
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);
app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
export default app;
//# sourceMappingURL=server.js.map