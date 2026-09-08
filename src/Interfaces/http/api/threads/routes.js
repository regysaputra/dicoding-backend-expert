import authenticateToken from "../../../../Infrastructures/middleware/authenticateToken.js";
import express from "express";
import validateRequestBody from "../../../../Infrastructures/middleware/validateRequestBody.js";
import {addThreadSchema} from "./schema.js";

const createThreadsRouter = (handler) => {
  const router = express.Router();

  router.get("/:threadId", handler.getThreadHandler);
  router.post("/", authenticateToken, validateRequestBody(addThreadSchema), handler.postThreadHandler);
  router.get("/", handler.getAllThreadHandler);

  return router;
};

export default createThreadsRouter;