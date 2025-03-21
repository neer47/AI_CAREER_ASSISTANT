import { Router } from "express";
import userRoutes  from "./user-routes.js";
import chatRoutes from "./chat-routes.js";
import interviewRoutes from "./interview-routes.js";
const appRouter = Router();

appRouter.use("/user", userRoutes);
appRouter.use("/chat", chatRoutes);
appRouter.use("/interview", interviewRoutes);

export default appRouter;