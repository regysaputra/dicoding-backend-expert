import AddThreadUseCase from "../../../../Applications/use_case/AddThreadUseCase.js";
import GetAllThreadUseCase from "../../../../Applications/use_case/GetAllThreadUseCase.js";
import GetThreadUseCase from "../../../../Applications/use_case/GetThreadUseCase.js";

export default class ThreadsHandler {
  #container;

  constructor(container) {
    this.#container = container;

    this.getAllThreadHandler = this.getAllThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async getAllThreadHandler(req, res, next) {
    const getAllThreadUseCase = this.#container.getInstance(GetAllThreadUseCase.name);

    try {
      const threads = await getAllThreadUseCase.execute();

      res.status(200).json({
        status: 'success',
        data: {
          threads,
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getThreadHandler(req, res, next) {
    const getThreadUseCase = this.#container.getInstance(GetThreadUseCase.name);

    try {
      const thread = await getThreadUseCase.execute(req.params.threadId);

      res.status(200).json({
        status: 'success',
        data: {
          thread,
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async postThreadHandler(req, res, next) {
    const addThreadUseCase = this.#container.getInstance(AddThreadUseCase.name);

    try {
      const addedThread = await addThreadUseCase.execute(req.body, req.credentials.id);

      res.status(201).json({
        status: 'success',
        data: {
          addedThread: {
            id: addedThread.id,
            title: addedThread.title,
            owner: addedThread.userId,
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}