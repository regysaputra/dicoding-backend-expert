import AddCommentUseCase from "../../../../Applications/use_case/AddCommentUseCase.js";
import DeleteCommentUseCase from "../../../../Applications/use_case/DeleteCommentUseCase.js";

export default class CommentsHandler {
  #container;

  constructor(container) {
    this.#container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(req, res, next) {
    const addCommentUseCase = this.#container.getInstance(AddCommentUseCase.name);

    try {
      const addedComment = await addCommentUseCase
        .execute(req.body, req.params.threadId, req.credentials.id);

      res.status(201).json({
        status: 'success',
        data: {
          addedComment: {
            id: addedComment.id,
            content: addedComment.content,
            owner: addedComment.userId,
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCommentHandler(req, res, next) {
    const deleteCommentUseCase = this.#container.getInstance(DeleteCommentUseCase.name);

    try {
      await deleteCommentUseCase.execute(
        req.params.threadId,
        req.params.commentId,
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