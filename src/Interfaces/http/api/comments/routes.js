import express from 'express';
import authenticateToken from "../../../../Infrastructures/middleware/authenticateToken.js";
import validateRequestBody from "../../../../Infrastructures/middleware/validateRequestBody.js";
import {addCommentSchema} from "./schema.js";

const createCommentsRouter = (handler) =>{
  const router = express.Router();

  router.post("/:threadId/comments", authenticateToken, validateRequestBody(addCommentSchema), handler.postCommentHandler);
  router.delete("/:threadId/comments/:commentId", authenticateToken, handler.deleteCommentHandler);

  return router;
};

export default createCommentsRouter;