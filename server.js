const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
// const connectToDb = require("./database/conn.js");
const router = require("./routes/routes.js");
const resultsRouter = require("./routes/resultsRoute.js");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { sendMailDaily } = require("./controllers/resultsController.js");
// const cron = require("node-cron");
const schedule = require("node-schedule");
const dotenv = require("dotenv"); // Add this line
// const MainArray = require("./module/pushDataSchema.js");
// const dataArrayOfMainData = require("./data.js");

dotenv.config(); // Load environment variables from a .env file

const app = express();

// ... (rest of your code)

/** using middleware */
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");
app.use(cookieParser());

/**End ponts call */
app.get("/", (req, res) => {
  res.status(201).json("Home Get Request");
});
app.use("/api", router);
app.use("/api/", resultsRouter);
// TODO  {{{{{{{{{{{{{{{{{{{{{{{{{{{ SET TIME }}}}}}}}}}}}}}}}}}}}}}}}}}}
schedule.scheduleJob("24 13 * * *", function () {
  try {
    sendMailDaily();
  } catch (error) {
    console.log(error);
  }
});

// cron.schedule("40 10 * * *", sendMailDaily);

/**Start server only when have valide connection */
// {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
function executeAtSpecificTime(targetHour, targetMinute, targetFunction) {
  const now = new Date();
  const targetTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    targetHour,
    targetMinute,
    0
  );

  if (now > targetTime) {
    targetTime.setDate(targetTime.getDate() + 1); // Move to the next day if the target time has already passed for today.
  }

  const timeDiff = targetTime - now;

  setTimeout(() => {
    targetFunction();
    // After executing the function, you can schedule it to run again tomorrow.
    executeAtSpecificTime(targetHour, targetMinute, targetFunction);
  }, timeDiff);
}

// Example: Execute a function at 3:30 PM daily
// TODO  {{{{{{{{{{{{{{{{{{{{{{{{{{{ SET TIME }}}}}}}}}}}}}}}}}}}}}}}}}}}

executeAtSpecificTime(13, 21, () => {
  sendMailDaily();
});
// {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}

// const findandUpdate = async () => {
//   try {
//     console.log("Working");
//     // dataArrayOfMainData.map((item) => {
//     //   console.log(item);
//     // });
//     const data = await MainArray.create({ data: dataArrayOfMainData });
//     console.log("Success");
//   } catch (error) {
//     console.log(error);
//   }
// };
mongoose
  .connect(process.env.DBURL) // Use process.env to access environment variables
  .then(() => {
    try {
      app.listen(process.env.PORT || 8080, () => {
        console.log(
          `server is started http://localhost:${process.env.PORT || 8080}`
        );
      });
    } catch (error) {
      console.log("Server Connection Failed");
      console.log(error);
    }
  })
  .catch((error) => {
    console.log("Invalid Database Connection");
  });

// findandUpdate();
