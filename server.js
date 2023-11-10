import express from "express";
import cors from "cors";
import morgon from "morgan";
import connectToDb from "./database/conn.js";
import router from "./routes/routes.js";
import resultsRouter from "./routes/resultsRoute.js";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { sendMailDaily } from "./controllers/resultsController.js";
import cron from "node-cron";
import schedule from "node-schedule";

const app = express();

/** using middleware */
app.use(express.json());
app.use(cors());
app.use(morgon("tiny"));
app.disable("x-powered-by");
app.use(cookieParser());

/**End ponts call */
app.get("/", (req, res) => {
  res.status(201).json("Home Get Request");
});
app.use("/api", router);
app.use("/api/", resultsRouter);

const Port = 8080;

schedule.scheduleJob("25 22 * * *", function () {
  try {
    sendMailDaily();
  } catch (error) {
    console.log(error);
  }
});

cron.schedule("30 22 * * *", sendMailDaily);

/**Start server only when have valide connection */
mongoose
  .connect(`${process.env.DBURL}`)
  .then(() => {
    try {
      app.listen(Port, () => {
        console.log(`server is started http://localhost:${Port}`);
      });
    } catch (error) {
      console.log("Server Connection Faild");
      console.log(error);
    }
  })
  .catch((error) => {
    console.log("invalid Database Connection");
  });
