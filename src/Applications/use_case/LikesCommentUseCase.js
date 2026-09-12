export default class LikesCommentUseCase {
  #threadRepository;
  #commentRepository;
  #commentLikesRepository;

  constructor({ threadRepository, commentRepository, commentLikesRepository }) {
    this.#threadRepository = threadRepository;
    this.#commentRepository = commentRepository;
    this.#commentLikesRepository = commentLikesRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, userId } = useCasePayload;

    // Check if thread exists
    await this.#threadRepository.verifyThreadAvailability(threadId);

    // Check if comment exists
    await this.#commentRepository.verifyCommentAvailability(commentId);

    // Check if user has already liked the comment
    const hasLiked = await this.#commentLikesRepository.hasUserLikedComment(commentId, userId);

    if (hasLiked) {
      // If the user has already liked the comment, remove the like
      await this.#commentLikesRepository.unlikeComment(commentId, userId);
    } else {
      // If the user hasn't liked the comment yet, add a like
      await this.#commentLikesRepository.likeComment(commentId, userId);
    }
  }
}