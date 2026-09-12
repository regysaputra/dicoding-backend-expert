import CommentLikeRepository from "../CommentLikeRepository.js";

describe("CommentLikeRepository", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const commentLikeRepository = new CommentLikeRepository();

    // Action & Assert
    await expect(commentLikeRepository.likeComment("", "")).rejects.toThrow(
      "COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(commentLikeRepository.unlikeComment("", "")).rejects.toThrow(
      "COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(
      commentLikeRepository.hasUserLikedComment("", "")
    ).rejects.toThrow("COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(
      commentLikeRepository.getLikesCountByCommentId("")
    ).rejects.toThrow("COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });
});