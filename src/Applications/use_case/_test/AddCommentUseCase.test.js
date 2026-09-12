import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import AddComment from '../../../Domains/comments/entities/AddComment.js';
import AddedComment from '../../../Domains/comments/entities/AddedComment.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddCommentUseCase from '../AddCommentUseCase.js';
import { jest } from '@jest/globals';

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'comment',
    };

    const threadId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91';
    const userId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f92';

    const mockAddedComment = new AddedComment({
      id: '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93',
      content: 'comment',
      userId: '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f92',
    });

    /** create dependencies of a use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking the necessary function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    /** create a use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload, threadId, userId);

    // Assert
    expect(addedComment).toEqual(new AddedComment({
      id: '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93',
      content: useCasePayload.content,
      userId: userId,
    }));
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(new AddComment({
      content: useCasePayload.content,
    }, threadId, userId));
  });
});
