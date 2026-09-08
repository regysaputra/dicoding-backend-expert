import AddReply from '../../Domains/replies/entities/AddReply.js';

class AddReplyUseCase {
  #threadRepository;

  #commentRepository;

  #replyRepository;

  constructor({ threadRepository, commentRepository, replyRepository }) {
    this.#threadRepository = threadRepository;
    this.#commentRepository = commentRepository;
    this.#replyRepository = replyRepository;
  }

  async execute (useCasePayload, threadId, commentId, userId) {
    const addReply = new AddReply(useCasePayload, commentId, userId);

    await this.#threadRepository.verifyThreadAvailability(threadId);
    await this.#commentRepository.verifyCommentAvailability(commentId);

    return this.#replyRepository.addReply(addReply);
  }
}

export default AddReplyUseCase;
