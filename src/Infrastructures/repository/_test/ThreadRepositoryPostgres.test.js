/* eslint-disable max-len */
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import AddThread from '../../../Domains/threads/entities/AddThread.js';
import AddedThread from '../../../Domains/threads/entities/AddedThread.js';
import pool from '../../database/postgres/pool.js';
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.js';

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  }, 1000);

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread ', async () => {
      // Arrange
      const id = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f92';
      const userId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91';

      const addThread = new AddThread({
        title: 'Thread Title',
        body: 'content',
      }, userId);
      const fakeIdGenerator = () => id // stub

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await UsersTableTestHelper.addUser({});
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const thread = await ThreadsTableTestHelper.verifyThreadAvailability(id);
      expect(thread).toHaveLength(1);
    }, 1000);

    it('should return added thread correctly', async () => {
      // Arrange
      const id = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f92';
      const userId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91';

      const addThread = new AddThread({
        title: 'Thread Title',
        body: 'content',
      }, userId);

      const fakeIdGenerator = () => id; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await UsersTableTestHelper.addUser({});
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: id,
        title: addThread.title,
        userId: userId,
      }));
    }, 1000);
  });

  describe('verifyThreadAvailability function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAvailability('01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f92'))
        .rejects
        .toThrow(NotFoundError);
    }, 1000);

    it('should not throw NotFoundError when thread exist', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAvailability("01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f92"))
        .resolves
        .not
        .toThrow(NotFoundError);
    }, 1000);
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f92'))
        .rejects
        .toThrow(NotFoundError);
    }, 1000);

    it('should return thread', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const id = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f92';
      const userId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91';

      // Action
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const thread = await threadRepositoryPostgres.getThreadById(id);

      // Assert
      expect(typeof thread).toEqual('object');
      expect(thread.id).toEqual(id);
      expect(thread.title).toEqual('sebuah thread');
      expect(thread.body).toEqual('sebuah body thread');
      expect(typeof thread.created_at).toEqual('object');
      expect(thread.username).toEqual('dicoding');
    }, 1000);
  });

  describe('getAllThread function', () => {
    it('should return all thread', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const threads = await threadRepositoryPostgres.getAllThread();

      // Assert
      expect(Array.isArray(threads)).toEqual(true);
      expect(threads[0].id).toEqual('01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f92');
      expect(threads[0].title).toEqual('sebuah thread');
      expect(threads[0].body).toEqual('sebuah body thread');
      expect(typeof threads[0].created_at).toEqual('object');
      expect(threads[0].username).toEqual('dicoding');
    }, 1000)
  })
});
