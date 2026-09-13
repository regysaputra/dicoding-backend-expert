import express from 'express';
import users from '../../Interfaces/http/api/users/index.js';
import authentications from '../../Interfaces/http/api/authentications/index.js';
import threads from "../../Interfaces/http/api/threads/index.js";
import comments from "../../Interfaces/http/api/comments/index.js";
import replies from "../../Interfaces/http/api/replies/index.js";
import errorHandler from "../middleware/errorHandler.js";

const createServer = async (container) => {
  const app = express();

  // Middleware for parsing JSON
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'ok' });
  });

  // Register routes
  app.use('/users', users(container));
  app.use('/authentications', authentications(container));
  app.use('/threads', replies(container));
  app.use('/threads', comments(container));
  app.use('/threads', threads(container));

  // Global error handler
  app.use(errorHandler);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      status: 'fail',
      message: 'Route not found',
    });
  });

  return app;
};

export default createServer;
