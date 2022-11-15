import express from "express";
import nunjucks from "nunjucks";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

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

app.use(express.urlencoded({ extended: true }));

app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
