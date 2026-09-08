import AuthorizationError from '../../Commons/exceptions/AuthorizationError.js';

class DeleteReplyUseCase {
  #threadRepository;

  #commentRepository;

  #replyRepository;

  constructor({ threadRepository, commentRepository, replyRepository }) {
    this.#threadRepository = threadRepository;
    this.#commentRepository = commentRepository;
    this.#replyRepository = replyRepository;
  }

  async execute(threadId, commentId, replyId, userId) {
    await this.#threadRepository.verifyThreadAvailability(threadId);
    await this.#commentRepository.verifyCommentAvailability(commentId);
    const reply = await this.#replyRepository.findReplyById(replyId);
    if (reply.user_id !== userId) {
      throw new AuthorizationError('Unauthorize user');
    }
    await this.#replyRepository.deleteReply(replyId);
  }
}

export default DeleteReplyUseCase;
