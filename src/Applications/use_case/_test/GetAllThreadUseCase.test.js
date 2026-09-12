/* eslint-disable camelcase */
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import GetAllThreadUseCase from '../GetAllThreadUseCase.js';
import { jest } from '@jest/globals';

describe('GetAllThreadUseCase', () => {
  it('should orchestrating get all thread action correctly', async () => {
    // Arrange
    const transformedThreads = [{
      id: 'thread-AqVg2b9JyQXR6wSQ2TmH4',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:59:16.198Z',
      username: 'regysaputra',
      total_discussion: 2
    }];

    const expectedThreads = [{
      thread_id: 'thread-AqVg2b9JyQXR6wSQ2TmH4',
      thread_title: 'sebuah thread',
      thread_body: 'sebuah body thread',
      thread_date: '2021-08-08T07:59:16.198Z',
      fk_user_id: 'user-123',
      user_id: 'user-123',
      user_username: 'regysaputra',
      user_password: '12345678',
      user_fullname: 'Dicoding Indonesia',
    }];

    const expectedComments = [
      {
        comment_id: 'comment-q_0uToswNf6i24RDYZJI3',
        comment_content: 'sebuah comment',
        comment_date: '2021-08-08T07:59:18.982Z',
        comment_is_delete: false,
        fk_thread_id: 'thread-AqVg2b9JyQXR6wSQ2TmH4',
        fk_user_id: 'user-123',
        user_id: 'user-123',
        user_username: 'regysaputra',
        user_password: '12345678',
        user_fullname: 'Dicoding Indonesia',
      }
    ];

    const expectedTotalReplyPerComment = 1;

    /** create dependencies of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getAllThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThreads));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));
    mockReplyRepository.getTotalReplyByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedTotalReplyPerComment));

    /** create use case instance */
    const getAllThreadUseCase = new GetAllThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
    });

    // Action
    const threads = await getAllThreadUseCase.execute();

    // Assert
    expect(threads).toEqual(transformedThreads);
    expect(mockThreadRepository.getAllThread).toHaveBeenCalled();
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(expectedThreads[0].thread_id);
    expect(mockReplyRepository.getTotalReplyByCommentId).toHaveBeenCalledWith(expectedComments[0].comment_id);
  });
});