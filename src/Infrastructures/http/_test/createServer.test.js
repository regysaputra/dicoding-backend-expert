import request from 'supertest';
import pool from '../../database/postgres/pool.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js';
import container from '../../container.js';
import createServer from '../createServer.js';
import AuthenticationTokenManager from '../../../Applications/security/AuthenticationTokenManager.js';
import DatabaseTestHelper from "../../../../tests/DatabaseTestHelper.js";
import AddUserUseCase from "../../../Applications/use_case/AddUserUseCase.js";
import AddCommentUseCase from "../../../Applications/use_case/AddCommentUseCase.js";
import DeleteCommentUseCase from "../../../Applications/use_case/DeleteCommentUseCase.js"
import AddReplyUseCase from "../../../Applications/use_case/AddReplyUseCase.js";
import DeleteReplyUseCase from "../../../Applications/use_case/DeleteReplyUseCase.js";
import AddThreadUseCase from "../../../Applications/use_case/AddThreadUseCase.js";
import GetThreadUseCase from "../../../Applications/use_case/GetThreadUseCase.js";
import GetAllThreadUseCase from "../../../Applications/use_case/GetAllThreadUseCase.js";
import LikesCommentUseCase from "../../../Applications/use_case/LikesCommentUseCase.js";

describe('HTTP server', () => {
  let shouldCleanDatabase = false;
  const createApp = () => {
       shouldCleanDatabase = true;
        return createServer(container);
  };

  beforeEach(() => {
    shouldCleanDatabase = false;
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await DatabaseTestHelper.cleanAllTables();
    if (shouldCleanDatabase) {
      await DatabaseTestHelper.cleanAllTables();
    }
  });

  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const app = await createApp(container);

    // Action
    const response = await request(app).get('/unregisteredRoute');

    // Assert
    expect(response.status).toEqual(404);
  });

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const app = await createApp();

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedUser).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        fullname: 'Dicoding Indonesia',
        password: 'secret',
      };
      const app = await createApp();

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: ['Dicoding Indonesia'],
      };
      const app = await createApp();

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai');
    });

    it('should response 400 when username more than 50 character', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const app = await createApp();

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('tidak dapat membuat user baru karena karakter username melebihi batas limit');
    });

    it('should response 400 when username contain restricted character', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding indonesia',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const app = await createApp();

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('tidak dapat membuat user baru karena username mengandung karakter terlarang');
    });

    it('should response 400 when username unavailable', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const requestPayload = {
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'super_secret',
      };
      const app = await createApp();

      // Action
      const response = await request(app).post('/users').send(requestPayload);

      // Assert
      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('username tidak tersedia');
    });
  });

  describe('when POST /authentications', () => {
    it('should response 201 and new authentication', async () => {
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const app = await createApp();

      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      const response = await request(app).post('/authentications').send(requestPayload);

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should response 400 if username not found', async () => {
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const app = await createApp();

      const response = await request(app).post('/authentications').send(requestPayload);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('username tidak ditemukan');
    });

    it('should response 401 if password wrong', async () => {
      const requestPayload = {
        username: 'dicoding',
        password: 'wrong_password',
      };
      const app = await createApp();

      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      const response = await request(app).post('/authentications').send(requestPayload);

      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('kredensial yang Anda masukkan salah');
    });

    it('should response 400 if login payload not contain needed property', async () => {
      const requestPayload = {
        username: 'dicoding',
      };
      const app = await createApp();

      const response = await request(app).post('/authentications').send(requestPayload);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('harus mengirimkan username dan password');
    });

    it('should response 400 if login payload wrong data type', async () => {
      const requestPayload = {
        username: 123,
        password: 'secret',
      };
      const app = await createApp();

      const response = await request(app).post('/authentications').send(requestPayload);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('username dan password harus string');
    });
  });

  describe('when PUT /authentications', () => {
    it('should return 200 and new access token', async () => {
      const app = await createApp();

      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      const loginResponse = await request(app).post('/authentications').send({
        username: 'dicoding',
        password: 'secret',
      });

      const { refreshToken } = loginResponse.body.data;
      const response = await request(app).put('/authentications').send({ refreshToken });

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('should return 400 payload not contain refresh token', async () => {
      const app = await createApp();

      const response = await request(app).put('/authentications').send({});

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('harus mengirimkan token refresh');
    });

    it('should return 400 if refresh token not string', async () => {
      const app = await createApp();

      const response = await request(app).put('/authentications').send({ refreshToken: 123 });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('refresh token harus string');
    });

    it('should return 400 if refresh token not valid', async () => {
      const app = await createApp();

      const response = await request(app).put('/authentications').send({ refreshToken: 'invalid_refresh_token' });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('refresh token tidak valid');
    });

    it('should return 400 if refresh token not registered in database', async () => {
      const app = await createApp();
      const refreshToken = await container.getInstance(AuthenticationTokenManager.name).createRefreshToken({ username: 'dicoding' });

      const response = await request(app).put('/authentications').send({ refreshToken });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('refresh token tidak ditemukan di database');
    });
  });

  describe('when DELETE /authentications', () => {
    it('should response 200 if refresh token valid', async () => {
      const app = await createApp();
      const refreshToken = 'refresh_token';
      await AuthenticationsTableTestHelper.addToken(refreshToken);

      const response = await request(app).delete('/authentications').send({ refreshToken });

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });

    it('should response 400 if refresh token not registered in database', async () => {
      const app = await createApp();
      const refreshToken = 'refresh_token';

      const response = await request(app).delete('/authentications').send({ refreshToken });

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('refresh token tidak ditemukan di database');
    });

    it('should response 400 if payload not contain refresh token', async () => {
      const app = await createApp();

      const response = await request(app).delete('/authentications').send({});

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('harus mengirimkan token refresh');
    });
  });

  describe("when GET /threads", () => {
    it('should response 200 and return list of threads', async () => {
      const app = await createApp();

      const response = await request(app).get('/threads');

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(Array.isArray(response.body.data.threads)).toEqual(true);
    });

    it('should handle server error correctly on GET /threads', async () => {
      const fakeContainer = {
        getInstance: (key) => {
          if (key === GetAllThreadUseCase.name) {
            return {
              execute: async () => {
                throw new Error('unexpected failure get all threads');
              },
            };
          }
          throw new Error('unknown dependency');
        },
      };

      const app = await createServer(fakeContainer);

      const response = await request(app).get('/threads');

      expect(response.status).toEqual(500);
      expect(response.body.status).toEqual('error');
      expect(response.body.message).toEqual('terjadi kegagalan pada server kami');
    });
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const app = await createApp();
      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      const authResponse = await request(app).post('/authentications').send({
        username: 'dicoding',
        password: 'secret',
      });

      const { accessToken } = authResponse.body.data;

      const requestPayload = {
        title: 'Thread Title',
        body: 'Thread body',
      };

      // Action
      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(requestPayload);

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedThread).toBeDefined();
    });

    it('should handle server error correctly on POST /threads', async () => {
      // get real token (middleware auth uses global container)
      const realApp = await createApp();

      await request(realApp)
        .post('/users')
        .send({ username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });

      const authResponse = await request(realApp)
        .post('/authentications')
        .send({ username: 'dicoding', password: 'secret' });

      const { accessToken } = authResponse.body.data;

      const fakeContainer = {
        getInstance: (key) => {
          if (key === AddThreadUseCase.name) {
            return {
              execute: async () => {
                throw new Error('unexpected failure add thread');
              },
            };
          }
          throw new Error('unknown dependency');
        },
      };

      const app = await createServer(fakeContainer);

      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Thread Title', body: 'Thread body' });

      expect(response.status).toEqual(500);
      expect(response.body.status).toEqual('error');
      expect(response.body.message).toEqual('terjadi kegagalan pada server kami');
    });
  });

  describe('when GET /threads/:id', () => {
    it('should return thread detail with comments and replies (including deleted reply replacement)', async () => {
      // Arrange - create app, two users (dicoding, johndoe) and login both
      const app = await createApp();

      // create users
      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      await request(app).post('/users').send({
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      });

      // login users
      const loginRes1 = await request(app).post('/authentications').send({
        username: 'dicoding',
        password: 'secret',
      });

      const accessToken1 = loginRes1.body.data.accessToken;

      const loginRes2 = await request(app).post('/authentications').send({
        username: 'johndoe',
        password: 'secret',
      });

      const accessToken2 = loginRes2.body.data.accessToken;

      // create a thread by dicoding
      const threadPayload = { title: 'sebuah thread', body: 'sebuah body thread' };
      const threadRes = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken1}`)
        .send(threadPayload);

      const threadId = threadRes.body.data.addedThread.id;

      // add a comment to the thread
      const commentRes = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send({ content: 'sebuah comment' });

      const commentId = commentRes.body.data.addedComment.id;

      const commentRes2 = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send({ content: 'sebuah comment 2' });

      const commentId2 = commentRes2.body.data.addedComment.id;

      // add a reply by johndoe, then delete it (to produce deleted-reply text)
      const replyRes1 = await request(app)
        .post(`/threads/${threadId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send({ content: 'a reply by johndoe' });

      const replyId1 = replyRes1.body.data.addedReply.id;

      // delete reply 1 as its owner (johndoe) -> will be marked deleted
      const deleteReplyRes = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}/replies/${replyId1}`)
        .set('Authorization', `Bearer ${accessToken2}`);

      // add another reply by dicoding (not deleted)
      const replyRes2 = await request(app)
        .post(`/threads/${threadId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${accessToken1}`)
        .send({ content: 'sebuah balasan' });

      const replyId2 = replyRes2.body.data.addedReply.id;

      // Action: GET thread detail (no auth required)
      const getRes = await request(app).get(`/threads/${threadId}`);
      const { thread } = getRes.body.data;

      // Assert
      expect(threadRes.status).toEqual(201);
      expect(commentRes.status).toEqual(201);
      expect(commentRes2.status).toEqual(201);
      expect(replyRes1.status).toEqual(201);
      expect(deleteReplyRes.status).toEqual(200);
      expect(replyRes2.status).toEqual(201);
      expect(getRes.status).toEqual(200);
      expect(getRes.body.status).toEqual('success');
      expect(thread).toBeDefined();
      expect(thread.id).toEqual(threadId);
      expect(thread.title).toEqual(threadPayload.title);
      expect(thread.body).toEqual(threadPayload.body);
      expect(thread.username).toEqual('dicoding');

      // comment assertions
      expect(Array.isArray(thread.comments)).toBe(true);
      expect(thread.comments).toHaveLength(2);

      const comment = thread.comments[0];
      expect(comment.id).toEqual(commentId);
      expect(comment.username).toEqual('johndoe');
      expect(comment.content).toEqual('sebuah comment');

      const comment2 = thread.comments[1];
      expect(comment2.id).toEqual(commentId2);
      expect(comment2.username).toEqual('johndoe');
      expect(comment2.content).toEqual('sebuah comment 2');

      // replies assertions (deleted-first, then active)
      expect(Array.isArray(comment.replies)).toBe(true);
      const [r1, r2] = comment.replies;
      expect(r1.id).toEqual(replyId1);
      expect(r1.content).toEqual('**balasan telah dihapus**'); // deleted reply text
      expect(r1.username).toEqual('johndoe');

      expect(r2.id).toEqual(replyId2);
      expect(r2.content).toEqual('sebuah balasan');
      expect(r2.username).toEqual('dicoding');
    });

    it('should handle server error correctly on GET /threads/:threadId', async () => {
      const fakeContainer = {
        getInstance: (key) => {
          if (key === GetThreadUseCase.name) {
            return {
              execute: async () => {
                throw new Error('unexpected failure get thread');
              },
            };
          }
          throw new Error('unknown dependency');
        },
      };

      const app = await createServer(fakeContainer);

      const response = await request(app).get('/threads/thread-123');

      expect(response.status).toEqual(500);
      expect(response.body.status).toEqual('error');
      expect(response.body.message).toEqual('terjadi kegagalan pada server kami');
    });
  });

  describe('when POST /threads/:threadId/comments', () => {
    it('should response 201 and persisted comment', async () => {
      const app = await createApp();

      await request(app).post('/users').send({ username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      const authResponse = await request(app).post('/authentications').send({ username: 'dicoding', password: 'secret' });
      const { accessToken } = authResponse.body.data;

      const threadRes = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 't1', body: 'b1' });

      const threadId = threadRes.body.data.addedThread.id;

      const response = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'a comment' });

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedComment).toBeDefined();
    });

    it('should handle server error correctly on POST /threads/:threadId/comments', async () => {
      // Arrange: create real token from real app
      const realApp = await createApp();

      await request(realApp)
        .post('/users')
        .send({ username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });

      const authResponse = await request(realApp)
        .post('/authentications')
        .send({ username: 'dicoding', password: 'secret' });

      const { accessToken } = authResponse.body.data;

      // Arrange: fake container only for comment use case
      const thrownError = new Error('unexpected failure add comment');
      const fakeContainer = {
        getInstance: (key) => {
          if (key === AddCommentUseCase.name) {
            return {
              execute: async () => {
                throw thrownError;
              },
            };
          }
          throw new Error('unknown dependency');
        },
      };

      const app = await createServer(fakeContainer);

      // Action
      const response = await request(app)
        .post('/threads/thread-123/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'a comment' });

      // Assert
      expect(response.status).toEqual(500);
      expect(response.body.status).toEqual('error');
      expect(response.body.message).toEqual('terjadi kegagalan pada server kami');
    });
  });

  describe('when DELETE /threads/:threadId/comments/:id', () => {
    it('should response 200 when delete comment successfuly', async () => {
      const app = await createApp();

      await request(app).post('/users').send({ username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      const authResponse = await request(app).post('/authentications').send({ username: 'dicoding', password: 'secret' });
      const { accessToken } = authResponse.body.data;

      const threadRes = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 't1', body: 'b1' });
      const threadId = threadRes.body.data.addedThread.id;

      const commentRes = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'a comment' });
      const commentId = commentRes.body.data.addedComment.id;

      const response = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });

    it('should handle server error correctly on DELETE /threads/:threadId/comments/:commentId', async () => {
      // Arrange: get real token first
      const realApp = await createApp();

      await request(realApp)
        .post('/users')
        .send({ username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });

      const authResponse = await request(realApp)
        .post('/authentications')
        .send({ username: 'dicoding', password: 'secret' });

      const { accessToken } = authResponse.body.data;

      // Arrange: fake container for delete use case error path
      const thrownError = new Error('unexpected failure delete comment');
      const fakeContainer = {
        getInstance: (key) => {
          if (key === DeleteCommentUseCase.name) {
            return {
              execute: async () => {
                throw thrownError;
              },
            };
          }
          throw new Error('unknown dependency');
        },
      };

      const app = await createServer(fakeContainer);

      // Action
      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-123')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(500);
      expect(response.body.status).toEqual('error');
      expect(response.body.message).toEqual('terjadi kegagalan pada server kami');
    });
  });

  describe("when PUT /threads/:threadId/comments/:commentId/likes", () => {
    it("should response 200 when like comment successfuly", async () => {
      const app = await createApp();

      await request(app).post('/users').send({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      });
      const authResponse = await request(app).post('/authentications').send({username: 'dicoding', password: 'secret'});
      const {accessToken} = authResponse.body.data;

      const threadRes = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({title: 't1', body: 'b1'});
      const threadId = threadRes.body.data.addedThread.id;

      const commentRes = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({content: 'a comment'});
      const commentId = commentRes.body.data.addedComment.id;

      const response = await request(app)
        .put(`/threads/${threadId}/comments/${commentId}/likes`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });

    it("should handle server error correctly", async () => {
      const realApp = await createApp();

      await request(realApp)
        .post('/users')
        .send({ username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });

      const authResponse = await request(realApp)
        .post('/authentications')
        .send({ username: 'dicoding', password: 'secret' });

      const { accessToken } = authResponse.body.data;

      const fakeContainer = {
        getInstance: (key) => {
          if (key === LikesCommentUseCase.name) {
            return {
              execute: async () => {
                throw new Error('unexpected failure like comment');
              },
            };
          }
          throw new Error('unknown dependency');
        },
      };

      const app = await createServer(fakeContainer);

      const response = await request(app)
        .put('/threads/thread-123/comments/comment-123/likes')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(500);
      expect(response.body.status).toEqual('error');
      expect(response.body.message).toEqual('terjadi kegagalan pada server kami');
    });
  });

  describe('when POST /threads/:threadId/comments/:commentId/replies', () => {
    it('should response 201 and persisted reply', async () => {
      const app = await createApp();

      await request(app).post('/users').send({ username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      const authResponse = await request(app).post('/authentications').send({ username: 'dicoding', password: 'secret' });
      const { accessToken } = authResponse.body.data;

      const threadRes = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 't1', body: 'b1' });
      const threadId = threadRes.body.data.addedThread.id;

      const commentRes = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'a comment' });
      const commentId = commentRes.body.data.addedComment.id;

      const response = await request(app)
        .post(`/threads/${threadId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'a reply' });

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedReply).toBeDefined();
    });

    it('should handle server error correctly on POST /threads/:threadId/comments/:commentId/replies', async () => {
      // Arrange: get real token
      const realApp = await createApp();

      await request(realApp)
        .post('/users')
        .send({ username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });

      const authResponse = await request(realApp)
        .post('/authentications')
        .send({ username: 'dicoding', password: 'secret' });

      const { accessToken } = authResponse.body.data;

      const fakeContainer = {
        getInstance: (key) => {
          if (key === AddReplyUseCase.name) {
            return {
              execute: async () => {
                throw new Error('unexpected failure add reply');
              },
            };
          }
          throw new Error('unknown dependency');
        },
      };

      const app = await createServer(fakeContainer);

      // Action
      const response = await request(app)
        .post('/threads/thread-123/comments/comment-123/replies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'a reply' });

      // Assert
      expect(response.status).toEqual(500);
      expect(response.body.status).toEqual('error');
      expect(response.body.message).toEqual('terjadi kegagalan pada server kami');
    });
  });

  describe('when DELETE /threads/:threadId/comments/:commentId/replies/:id', () => {
    it('should response 200 when delete reply successfuly', async () => {
      const app = await createApp();

      await request(app).post('/users').send({ username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      const authResponse = await request(app).post('/authentications').send({ username: 'dicoding', password: 'secret' });
      const { accessToken } = authResponse.body.data;

      const threadRes = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 't1', body: 'b1' });
      const threadId = threadRes.body.data.addedThread.id;

      const commentRes = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'a comment' });
      const commentId = commentRes.body.data.addedComment.id;

      const replyRes = await request(app)
        .post(`/threads/${threadId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'a reply' });
      const replyId = replyRes.body.data.addedReply.id;

      const response = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}/replies/${replyId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });

    it('should handle server error correctly on DELETE /threads/:threadId/comments/:commentId/replies/:id', async () => {
      // Arrange: get real token
      const realApp = await createApp();

      await request(realApp)
        .post('/users')
        .send({ username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });

      const authResponse = await request(realApp)
        .post('/authentications')
        .send({ username: 'dicoding', password: 'secret' });

      const { accessToken } = authResponse.body.data;

      const fakeContainer = {
        getInstance: (key) => {
          if (key === DeleteReplyUseCase.name) {
            return {
              execute: async () => {
                throw new Error('unexpected failure delete reply');
              },
            };
          }
          throw new Error('unknown dependency');
        },
      };

      const app = await createServer(fakeContainer);

      // Action
      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-123/replies/reply-123')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(500);
      expect(response.body.status).toEqual('error');
      expect(response.body.message).toEqual('terjadi kegagalan pada server kami');
    });
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret',
    };

    const fakeContainer = {
      getInstance: (key) => {
        if (key === AddUserUseCase.name) {
          return {
            execute: async () => {
              throw new Error('unexpected failure');
            },
          };
        }
        throw new Error('unknown dependency');
      },
    };

    const app = await createServer(fakeContainer);

    // Action
    const response = await request(app).post('/users').send(requestPayload);

    // Assert
    expect(response.status).toEqual(500);
    expect(response.body.status).toEqual('error');
    expect(response.body.message).toEqual('terjadi kegagalan pada server kami');
  });
});
