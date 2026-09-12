import { jest } from '@jest/globals';
import LikesCommentUseCase from "../LikesCommentUseCase.js";

describe("LikesCommentRepositoryUseCase", () => {
  it("should orchestrating the like comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      userId: "user-123",
    };

    /** create dependencies of a use case */
    const mockThreadRepository = {
      verifyThreadAvailability: jest.fn().mockResolvedValue(),
    };
    const mockCommentRepository = {
      verifyCommentAvailability: jest.fn().mockResolvedValue(),
      likeComment: jest.fn().mockResolvedValue(),
      unlikeComment: jest.fn().mockResolvedValue(),
    };
    const mockCommentLikesRepository = {
      likeComment: jest.fn().mockResolvedValue(),
      unlikeComment: jest.fn().mockResolvedValue(),
      hasUserLikedComment: jest.fn().mockResolvedValue(false),
    };

    /** create a use case instance */
    const likesCommentUseCase = new LikesCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikesRepository: mockCommentLikesRepository,
    });

    // Action
    await likesCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith(
      useCasePayload.commentId
    );
    expect(mockCommentLikesRepository.hasUserLikedComment).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.userId
    );
    expect(mockCommentLikesRepository.likeComment).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.userId
    );
  });

  it("should orchestrating the unlike comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      userId: "user-123",
    };

    /** create dependencies of a use case */
    const mockThreadRepository = {
      verifyThreadAvailability: jest.fn().mockResolvedValue(),
    };
    const mockCommentRepository = {
      verifyCommentAvailability: jest.fn().mockResolvedValue(),
      likeComment: jest.fn().mockResolvedValue(),
      unlikeComment: jest.fn().mockResolvedValue(),
    };
    const mockCommentLikesRepository = {
      likeComment: jest.fn().mockResolvedValue(),
      unlikeComment: jest.fn().mockResolvedValue(),
      hasUserLikedComment: jest.fn().mockResolvedValue(true),
    };

    /** create a use case instance */
    const likesCommentUseCase = new LikesCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikesRepository: mockCommentLikesRepository,
    });

    // Action
    await likesCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith(
      useCasePayload.commentId
    );
    expect(mockCommentLikesRepository.hasUserLikedComment).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.userId
    );
    expect(mockCommentLikesRepository.unlikeComment).toHaveBeenCalledWith(
      useCasePayload.commentId,
      useCasePayload.userId
    );
  });

  it("should throw error when thread does not exist", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      userId: "user-123",
    };

    /** create dependencies of a use case */
    const mockThreadRepository = {
      verifyThreadAvailability: jest.fn().mockRejectedValue(new Error("Thread not found")),
    };
    const mockCommentRepository = {
      verifyCommentAvailability: jest.fn(),
      likeComment: jest.fn(),
      unlikeComment: jest.fn(),
    };
    const mockCommentLikesRepository = {
      hasUserLikedComment: jest.fn(),
    };

    /** create a use case instance */
    const likesCommentUseCase = new LikesCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikesRepository: mockCommentLikesRepository,
    });

    // Action & Assert
    await expect(likesCommentUseCase.execute(useCasePayload)).rejects.toThrow("Thread not found");
  });

  it("should throw error when comment does not exist", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      userId: "user-123",
    };

    /** create dependencies of a use case */
    const mockThreadRepository = {
      verifyThreadAvailability: jest.fn().mockResolvedValue(),
    };
    const mockCommentRepository = {
      verifyCommentAvailability: jest.fn().mockRejectedValue(new Error("Comment not found")),
      likeComment: jest.fn(),
      unlikeComment: jest.fn(),
    };
    const mockCommentLikesRepository = {
      hasUserLikedComment: jest.fn(),
    };

    /** create a use case instance */
    const likesCommentUseCase = new LikesCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikesRepository: mockCommentLikesRepository,
    });

    // Action & Assert
    await expect(likesCommentUseCase.execute(useCasePayload)).rejects.toThrow("Comment not found");
  })
});