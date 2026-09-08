import express from 'express';
import validateRequestBody from "../../../../Infrastructures/middleware/validateRequestBody.js";
import {loginSchema, updateSchema} from "./schema.js";

const createAuthenticationsRouter = (handler) => {
  const router = express.Router();

  router.post('/', validateRequestBody(loginSchema), handler.postAuthenticationHandler);
  router.put('/', validateRequestBody(updateSchema), handler.putAuthenticationHandler);
  router.delete('/', handler.deleteAuthenticationHandler);

  return router;
};

export default createAuthenticationsRouter;
