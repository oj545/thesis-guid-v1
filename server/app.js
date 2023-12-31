const express = require("express");
const cors = require("cors");

const helmet = require("helmet");
const limiter = require("./middleware/limiter");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

const AppError = require("./utils/appError");
const userRouter = require("./routes/userRoutes");
const chapterRoutes = require("./routes/chapterRoutes");
const checkListRoutes = require("./routes/checkListRouter");
const errorController = require("./controllers/errorController");

const app = express();
app.use(cors());

// 1)SECURITY AND  GLOBAL MIDELLWARES

// set secutrity HTTP headers
app.use(helmet());

// limit request from the same IP
app.use("/api", limiter);

// body parser data limeted
app.use(express.json({ limit: "10kb" }));

// data sanititzation against query injection
app.use(mongoSanitize());

// prevent prameter pollution
app.use(hpp({ whitelist: ["title"] }));

// 2) ROUTES
app.use("/api/users", userRouter);
app.use("/api/chapters", chapterRoutes);
app.use("/api/checkList", checkListRoutes);

// 5) ERROR CONTROLLER
app.use(errorController);

module.exports = app;
