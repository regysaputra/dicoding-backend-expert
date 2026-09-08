import RepliesHandler from "./handler.js";
import createRepliesRouter from "./routes.js";

export default (container) => {
  const threadsHandler = new RepliesHandler(container);
  return createRepliesRouter(threadsHandler);
};