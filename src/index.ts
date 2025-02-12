import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import compression from "compression";
import express, { NextFunction, Request, Response } from "express";

import { homeMiddleware } from "./middleware/home";
import { loggerMiddleware } from "./middleware/logger";
import { errorMiddleware, pathErrorMiddleware } from "./middleware/error";
import { initDB } from "./service/initDB";

const app = express();

const PORT = process.env.PORT;

app.use(cors());
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
