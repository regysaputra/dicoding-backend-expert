import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import RepliesTabletestHelper from '../../../../tests/RepliesTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import AddReply from '../../../Domains/replies/entities/AddReply.js';
import AddedReply from '../../../Domains/replies/entities/AddedReply.js';
import pool from '../../database/postgres/pool.js';
import ReplyRepositoryPostgres from '../ReplyRepositoryPostgres.js';

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTabletestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  }, 1000);

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply', async () => {
      // Arrange
      const id = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f94';
      const commentId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93';
      const userId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91';

      const addReply = new AddReply({
        content: 'reply',
      }, commentId, userId);

      const fakeIdGenerator = () => id;
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action
      await replyRepositoryPostgres.addReply(addReply);
      const reply = await RepliesTabletestHelper.findReplyById(id);

      // Assert
      expect(reply).toHaveLength(1);
    }, 1000);

    it('should return added reply correctly', async () => {
      // Arrange
      const id = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f94';
      const commentId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93';
      const userId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91';

      const addReply = new AddReply({
        content: 'reply',
      }, commentId, userId);

      const fakeIdGenerator = () => id;
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const addedReply = await replyRepositoryPostgres.addReply(addReply);

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: id,
        content: 'reply',
        userId: userId,
      }));
    }, 1000);
  });

  describe('findReplyById function', () => {
    it('should throw NotFoundError when reply does not exist', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.findReplyById('01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f95'))
        .rejects
        .toThrow(NotFoundError);
    }, 1000);

    it('should return reply', async () => {
      // Arrange
      const id = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f94';
      const commentId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93';
      const userId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTabletestHelper.addReplies({});

      // Action
      const reply = await replyRepositoryPostgres.findReplyById(id);

      // Assert
      expect(reply.id).toEqual(id);
      expect(reply.content).toEqual('sebuah balasan');
      expect(reply.created_at).toBeDefined();
      expect(reply.is_deleted).toEqual(false);
      expect(reply.comment_id).toEqual(commentId);
      expect(reply.user_id).toEqual(userId);
    }, 1000);
  });

  describe('getRepliesByCommentIds', () => {
    it('should return empty array when reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const reply = await replyRepositoryPostgres.getRepliesByCommentIds(['01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f95']);

      // Assert
      expect(reply).toEqual([]);
    }, 1000);

    it('should return array containing reply', async () => {
      // Arrange
      const id = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f94';
      const commentId = ['01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93'];

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTabletestHelper.addReplies({});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByCommentIds(commentId);

      // Assert
      expect(Array.isArray(replies)).toEqual(true);
      expect(typeof replies[0]).toEqual('object');
      expect(replies[0].id).toEqual(id);
      expect(replies[0].content).toEqual('sebuah balasan');
      expect(typeof replies[0].created_at).toEqual('object');
      expect(replies[0].username).toEqual('dicoding');
      expect(typeof replies[0].is_deleted).toEqual('boolean');
    }, 1000);
  });

  describe('deleteReply function', () => {
    it('should delete reply successfully', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTabletestHelper.addReplies({});

      // Action
      await replyRepositoryPostgres.deleteReply('01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f94');
      const reply = await RepliesTabletestHelper.findReplyById('01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f94');

      // Assert
      expect(reply[0].is_deleted).toEqual(true);
    }, 1000);
  });

  describe('getTotalReplyByCommentId', () => {
    it('should return total reply', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTabletestHelper.addReplies({});

      // Action
      const totalReply = await replyRepositoryPostgres.getTotalReplyByCommentId('01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93');

      // Assert
      expect(totalReply).toEqual('1');
    }, 1000);
  });
});
