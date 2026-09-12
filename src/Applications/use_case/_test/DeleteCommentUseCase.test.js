/* eslint-disable camelcase */
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import DeleteCommentUseCase from '../DeleteCommentUseCase.js';
import { jest } from '@jest/globals';

describe('DeleteCommentUseCase', () => {
  it('should throw AuthorizationError when user not belong to the comment', async () => {
    // Arrange
    const comment = {
      id: 'comment-123',
      content: 'comment',
      created_at: '2024-03-12T14:25:10',
      is_deleted: false,
      thread_id: 'thread-123',
      user_id: 'user-123',
    };

    /** Create dependencies of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking necessary function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.findCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(comment));

    /** create a use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Assert
    await expect(deleteCommentUseCase.execute('thread-123', 'comment-123', 'user-100'))
      .rejects
      .toThrow(AuthorizationError);
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.findCommentById).toHaveBeenCalledWith('comment-123');
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const comment = {
      id: 'comment-123',
      content: 'comment',
      created_at: '2024-03-12',
      is_deleted: false,
      thread_id: 'thread-123',
      user_id: 'user-123',
    };

    /** Create dependencies of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.findCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(comment));
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** create a use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute('thread-123', 'comment-123', 'user-123');

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability)
      .toHaveBeenCalledWith('thread-123');
    expect(mockCommentRepository.findCommentById)
      .toHaveBeenCalledWith('comment-123');
    expect(mockCommentRepository.deleteComment)
      .toHaveBeenCalledWith('comment-123');
  });
});
