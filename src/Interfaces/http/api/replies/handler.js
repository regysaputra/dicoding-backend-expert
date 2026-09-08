import AddReplyUseCase from "../../../../Applications/use_case/AddReplyUseCase.js";
import DeleteReplyUseCase from "../../../../Applications/use_case/DeleteReplyUseCase.js";

export default class RepliesHandler {
  #container;

  constructor(container) {
    this.#container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(req, res, next) {
    const addReplyUseCase = this.#container.getInstance(AddReplyUseCase.name);

    try {
      const addedReply = await addReplyUseCase
        .execute(req.body, req.params.threadId, req.params.commentId, req.credentials.id);

      res.status(201).json({
        status: 'success',
        data: {
          addedReply: {
            id: addedReply.id,
            content: addedReply.content,
            owner: addedReply.userId,
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteReplyHandler(req, res, next) {
    const deleteReplyUseCase = this.#container.getInstance(DeleteReplyUseCase.name);

    try {
      await deleteReplyUseCase.execute(
        req.params.threadId,
        req.params.commentId,
        req.params.replyId,
        req.credentials.id
      );

      res.json({
        status: 'success'
      });
    } catch (error) {
      next(error);
    }
  }
}