// app.js:
import express from "express";
import userRoutes from "./src/routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import foodRoutes from "./src/routes/food.routes.js";
import orderRoutes from "./src/routes/order.routes.js";

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://momofullstack.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// cookieParser middleware used for parsing cookie which has credentials in it which can be used for authentication and authorization purpose.
app.use(cookieParser());

// mount userRoutes at the /api/users base path
app.use("/api/users", userRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);

export default app;