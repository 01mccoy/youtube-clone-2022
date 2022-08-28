import express from "express";
import nunjucks from "nunjucks";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const PORT = 4000;

const app = express();
const logger = morgan("dev");

app.set("view engine", "html");
app.set("views", process.cwd() + "/src/views");

nunjucks.configure(app.get("views"), {
  autoescape: true,
  express: app,
  watch: true,
});

app.use(logger);

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

const handleListening = () =>
  console.log(`Server listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening);
