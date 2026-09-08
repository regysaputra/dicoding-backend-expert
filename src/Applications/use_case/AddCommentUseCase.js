import AddComment from '../../Domains/comments/entities/AddComment.js';

class AddCommentUseCase {
  #threadRepository;

  #commentRepository;

  constructor({ threadRepository, commentRepository }) {
    this.#threadRepository = threadRepository;
    this.#commentRepository = commentRepository;
  }

  async execute(useCasePayload, threadId, userId) {
    const addComment = new AddComment(useCasePayload, threadId, userId);
    await this.#threadRepository.verifyThreadAvailability(addComment.threadId);
    return this.#commentRepository.addComment(addComment);
  }
}

export default AddCommentUseCase;
