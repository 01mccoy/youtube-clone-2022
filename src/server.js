import express from "express";
import nunjucks from "nunjucks";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./middlewares";

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

app.use(
  session({
    secret: "Hello!",
    resave: true,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  req.sessionStore.all((error, sessions) => {
    console.log(sessions);
    next();
  });
});

app.use(localsMiddleware);

app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
