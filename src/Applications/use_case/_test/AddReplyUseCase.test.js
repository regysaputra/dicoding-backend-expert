import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import AddReply from '../../../Domains/replies/entities/AddReply.js';
import AddedReply from '../../../Domains/replies/entities/AddedReply.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddReplyUseCase from '../AddReplyUseCase.js';
import { jest } from '@jest/globals';

describe('AddReplyUseCase', () => {
  it('should orchestrating add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'reply',
    };

    const id = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93';
    const threadId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91';
    const commentId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f92';
    const userId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f90';

    const mockAddedReply = new AddedReply({
      id: id,
      content: 'reply',
      userId: userId,
    });

    /** create dependencies of a use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking the necessary function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    /** Create a use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload, threadId, commentId, userId);

    // Assert
    expect(addedReply).toEqual(new AddedReply({
      id: id,
      content: 'reply',
      userId: userId,
    }));
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentAvailability).toHaveBeenCalledWith(commentId);
    expect(mockReplyRepository.addReply).toHaveBeenCalledWith(new AddReply({
      content: useCasePayload.content,
    }, commentId, userId));
  });
});
