import express from "express";
import authenticateToken from "../../../../Infrastructures/middleware/authenticateToken.js";
import validateRequestBody from "../../../../Infrastructures/middleware/validateRequestBody.js";
import {addReplySchema} from "./schema.js";

const createRepliesRouter = (handler) => {
  const router = express.Router();

  router.post("/:threadId/comments/:commentId/replies", authenticateToken, validateRequestBody(addReplySchema), handler.postReplyHandler);
  router.delete("/:threadId/comments/:commentId/replies/:replyId", authenticateToken, handler.deleteReplyHandler);

  return router;
};

export default createRepliesRouter;