/* eslint-disable camelcase */
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import DeleteReplyUseCase from '../DeleteReplyUseCase.js';
import { jest } from '@jest/globals';

describe('DeleteReplyUseCase', () => {
  it('should throw AuthorizationError when reply not belong to the user', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';
    const userId = 'user-100';
    const reply = {
      id: 'reply-123',
      content: 'reply',
      date: '2024-03-12T16:30:01Z675',
      is_delete: false,
      fk_comment_id: 'comment-123',
      fk_user_id: 'user-123',
    };

    /** Create dependencies of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.findReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve(reply));

    /** create use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute(threadId, commentId, replyId, userId))
      .rejects
      .toThrow(AuthorizationError);
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith(commentId);
    expect(mockReplyRepository.findReplyById).toHaveBeenCalledWith(replyId);
  });

  it('should orchestrating delete reply action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';
    const userId = 'user-123';
    const reply = {
      id: 'reply-123',
      content: 'reply',
      date: '2024-03-12T16:30:01Z675',
      is_deleted: false,
      comment_id: 'comment-123',
      user_id: 'user-123',
    };

    /** Create dependencies of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.findReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve(reply));
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** create a use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(threadId, commentId, replyId, userId);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith(commentId);
    expect(mockReplyRepository.findReplyById).toHaveBeenCalledWith(replyId);
    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith(replyId);
  });
});
