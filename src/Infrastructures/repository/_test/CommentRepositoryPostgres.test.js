import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import AddComment from '../../../Domains/comments/entities/AddComment.js';
import AddedComment from '../../../Domains/comments/entities/AddedComment.js';
import pool from '../../database/postgres/pool';
import CommentRepositoryPostgres from '../CommentRepositoryPostgres';

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  }, 1000);

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment', async () => {
      // Arrange
      const id = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93';
      const threadId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f92';
      const userId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91';

      const addComment = new AddComment({
        content: 'comment',
      }, threadId, userId);
      const fakeIdGenerator = () => id; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(id);
      expect(comment).toHaveLength(1);
    }, 1000);

    it('should return added comment correctly', async () => {
      // Arrange
      const id = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93';
      const threadId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f92';
      const userId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91';

      const addComment = new AddComment({
        content: 'comment',
      }, threadId, userId);

      const fakeIdGenerator = () => id;
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: id,
        content: 'comment',
        userId: userId,
      }));
    }, 1000);
  });

  describe('verifyCommentAvailability function', () => {
    it('should throw NotFoundError when comment does not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f95'))
        .rejects
        .toThrow(NotFoundError);
    }, 1000);

    it('should not throw NotFoundError when comment exist', async () => {
      // Arrange
      const id = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability(id))
        .resolves
        .not
        .toThrow(NotFoundError);
    }, 1000);
  });

  describe('findCommentById function', () => {
    it('should throw NotFoundError when comment does not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.findCommentById('01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f95'))
        .rejects
        .toThrow(NotFoundError);
    }, 1000);

    it('should not throw NotFoundError when comment exist', async () => {
      // Arrang
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action & Assert
      await expect(commentRepositoryPostgres.findCommentById('01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93'))
        .resolves
        .not
        .toThrow(NotFoundError);
    }, 1000);

    it('should return comment when comment exist', async () => {
      // Arrange
      const id = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93';
      const threadId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f92';
      const userId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action
      const comment = await commentRepositoryPostgres.findCommentById(id);

      // Assert
      expect(typeof comment).toEqual('object');
      expect(comment.id).toEqual(id);
      expect(comment.content).toEqual('sebuah komentar');
      expect(comment.created_at).toBeDefined();
      expect(comment.is_deleted).toEqual(false);
      expect(comment.thread_id).toEqual(threadId);
      expect(comment.user_id).toEqual(userId);
    }, 1000);
  });

  describe('getCommentByThreadId', () => {
    it('should return empty array when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comment = await commentRepositoryPostgres.getCommentsByThreadId('01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91');

      // Assert
      expect(comment).toEqual([]);
    }, 1000);

    it('should return array containing comment', async () => {
      // Arrange
      const id = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93';
      const threadId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f92';
      const userId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(threadId);

      // Assert
      expect(Array.isArray(comments)).toEqual(true);
      expect(comments).toHaveLength(1);
      expect(typeof comments[0]).toEqual('object');
      expect(comments[0].id).toEqual(id);
      expect(comments[0].content).toEqual('sebuah komentar');
      expect(typeof comments[0].created_at).toEqual('object');
      expect(comments[0].username).toEqual("dicoding");
      expect(typeof comments[0].is_deleted).toEqual('boolean');
    }, 1000);
  });

  describe('deleteComment function', () => {
    it('should delete comment succesfully', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const id = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93';
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action
      await commentRepositoryPostgres.deleteComment(id);
      const comment = await CommentsTableTestHelper.findCommentById(id);

      // Assert
      expect(comment[0].is_deleted).toEqual(true);
    }, 1000);
  });
});
