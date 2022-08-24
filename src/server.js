import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const PORT = 3000;

const app = express();
const logger = morgan("dev");

app.set("view engine", "ejs");
app.set("views", process.cwd() + "/src/views");
app.engine("html", require("ejs").renderFile);
app.use(express.static(process.cwd() + "/src/public"));

app.use(logger);

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

const handleListening = () =>
  console.log(`Server listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening);
