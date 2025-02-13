import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import compression from "compression";

import { initDB } from "./service/initDB";

import { homeMiddleware } from "./middleware/home";
import { loggerMiddleware } from "./middleware/logger";
import { errorMiddleware, pathErrorMiddleware } from "./middleware/error";
import authRoute from "./route/auth.route";
import userRoute from "./route/user.route";

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: process.env.CORS_METHODS?.split(","),
    allowedHeaders: process.env.CORS_HEADERS,
    credentials: process.env.CORS_CREDENTIALS === "true",
  })
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===== LOG ===== */
app.use(loggerMiddleware);

/* ===== HOMEPAGE ===== */
app.get("/", homeMiddleware);

/* ===== ROUTES ===== */
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ msg: "test" });
});
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/expense", () => {});
app.use("/category", () => {});

/* ===== ERROR ===== */
app.use(errorMiddleware);
app.use("*", pathErrorMiddleware);

app.listen(PORT, async () => {
  try {
    const dbPass = await initDB(
      process.env.DB_SYNC_MODE === "true" ? true : false
    );

    if (!dbPass) {
      throw new Error("DB connection failed");
    }

    console.log(
      `
  =====================================

    Sever Starting Success
    Server is running on port: ${PORT}

  =====================================
`
    );
  } catch (error) {
    console.log(
      `
    =====================================
  
      Server error on start up: 
      ${error}
  
    =====================================
  `
    );
  }
});
