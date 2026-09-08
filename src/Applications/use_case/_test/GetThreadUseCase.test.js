import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import GetThreadUseCase from '../GetThreadUseCase.js';
import { jest } from '@jest/globals';

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly when thread has no comments', async () => {
    // Arrange
    const threadId = 'thread-123';
    const thread = {
      id: 'thread-123',
      title: 'title',
      body: 'body',
      created_at: '2021',
      username: 'user',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(thread));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve([]));

    mockReplyRepository.getRepliesByCommentIds = jest.fn();

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const detailThread = await getThreadUseCase.execute(threadId);

    // Assert
    expect(detailThread.comments).toHaveLength(0);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentIds).not.toHaveBeenCalled();
  });

  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-AqVg2b9JyQXR6wSQ2TmH4';
    const commentId = ['comment-q_0uToswNf6i24RDYZJI3', 'comment-dUyuToswNf0Z24RDYZJKO'];
    const thread = {
      id: 'thread-AqVg2b9JyQXR6wSQ2TmH4',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      created_at: '2021-08-08T07:59:16.198Z',
      username: 'regysaputra',
    };
    const comments = [
      {
        id: 'comment-q_0uToswNf6i24RDYZJI3',
        content: 'sebuah comment',
        created_at: '2021-08-08T07:59:18.982Z',
        is_deleted: false,
        username: 'regysaputra'
      },
      {
        id: 'comment-dUyuToswNf0Z24RDYZJKO',
        content: 'sebuah comment',
        created_at: '2021-08-10T07:59:18.982Z',
        is_deleted: true,
        username: 'andi'
      },
    ];
    const replies = [
      {
        id: 'reply-BErOXUSefjwWGW1Z10Ihk',
        content: 'sebuah balasan',
        created_at: '2021-08-08T07:59:48.766Z',
        is_deleted: true,
        comment_id: 'comment-q_0uToswNf6i24RDYZJI3',
        username: 'johndoe',
      },
      {
        id: 'reply-xNBtm9HPR-492AeiimpfN',
        content: 'sebuah balasan',
        created_at: '2021-08-08T08:07:01.522Z',
        is_deleted: false,
        comment_id: 'comment-q_0uToswNf6i24RDYZJI3',
        username: 'regysaputra',
      },
    ];

    const transformThread = {
      id: 'thread-AqVg2b9JyQXR6wSQ2TmH4',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:59:16.198Z',
      username: 'regysaputra',
      comments: [
        {
          id: 'comment-q_0uToswNf6i24RDYZJI3',
          username: 'regysaputra',
          date: '2021-08-08T07:59:18.982Z',
          content: 'sebuah comment',
          replies: [
            {
              id: 'reply-BErOXUSefjwWGW1Z10Ihk',
              content: '**balasan telah dihapus**',
              date: '2021-08-08T07:59:48.766Z',
              username: 'johndoe',
            },
            {
              id: 'reply-xNBtm9HPR-492AeiimpfN',
              content: 'sebuah balasan',
              date: '2021-08-08T08:07:01.522Z',
              username: 'regysaputra',
            },
          ],
        },
        {
          id: 'comment-dUyuToswNf0Z24RDYZJKO',
          username: 'andi',
          date: '2021-08-10T07:59:18.982Z',
          content: '**komentar telah dihapus**',
          replies: [],
        },
      ],
    };

    /** create dependencies of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));
    mockReplyRepository.getRepliesByCommentIds = jest.fn()
      .mockImplementation(() => Promise.resolve(replies));

    /** create a use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const detailThread = await getThreadUseCase.execute(threadId);

    // Assert
    expect(detailThread).toEqual(transformThread);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentIds).toHaveBeenCalledWith(commentId);
  });
});
