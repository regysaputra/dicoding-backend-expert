import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import pool from "../../database/postgres/pool.js";
import CommentLikesTableTestHelper from "../../../../tests/CommentLikesTableTestHelper.js";
import CommentLikeRepositoryPostgres from "../CommentLikeRepositoryPostgres.js";

describe('CommentLikeRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  }, 2000);

  afterAll(async () => {
    await pool.end();
  });

  describe("likeComment function", () => {
    it("should add like comment to database", async () => {
      // Arrange
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool);
      const commentId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93';
      const userId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91';
      await UsersTableTestHelper.addUser({ });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ });

      // Action
      await commentLikeRepository.likeComment(commentId, userId);

      // Assert
      const commentLikes = await CommentLikesTableTestHelper.findCommentByCommentAndUserId(commentId, userId);
      expect(commentLikes).toHaveLength(1);
      expect(commentLikes[0].comment_id).toBe(commentId);
      expect(commentLikes[0].user_id).toBe(userId);
    });
  });

  describe("unlikeComment function", () => {
    it("should remove like comment from database", async () => {
      // Arrange
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool);
      const commentId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93';
      const userId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91';
      await UsersTableTestHelper.addUser({ });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ });
      await CommentLikesTableTestHelper.likeComment({ commentId, userId });

      // Action
      await commentLikeRepository.unlikeComment(commentId, userId);

      // Assert
      const commentLikes = await CommentLikesTableTestHelper.findCommentByCommentAndUserId(commentId, userId);
      expect(commentLikes).toHaveLength(0);
    });
  });

  describe("hasUserLikedComment", () => {
    it("should return true if user has liked the comment", async () => {
      // Arrange
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool);
      const commentId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93';
      const userId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91';
      await UsersTableTestHelper.addUser({ });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ });
      await CommentLikesTableTestHelper.likeComment({ commentId, userId });

      // Action
      const hasLiked = await commentLikeRepository.hasUserLikedComment(commentId, userId);

      // Assert
      expect(hasLiked).toBe(true);
    });

    it("should return false if user has not liked the comment", async () => {
      // Arrange
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool);
      const commentId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93';
      const userId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91';

      // Action
      const hasLiked = await commentLikeRepository.hasUserLikedComment(commentId, userId);

      // Assert
      expect(hasLiked).toBe(false);
    });
  });

  describe("getLikesCountByCommentIds", () => {
    it("should return likes count for multiple comments", async () => {
      // Arrange
      const commentLikeRepository = new CommentLikeRepositoryPostgres(pool);
      const commentId1 = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93';
      const commentId2 = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f99';
      const userId1 = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91';
      const userId2 = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f96';
      await UsersTableTestHelper.addUser({ id: userId1 });
      await UsersTableTestHelper.addUser({ id: userId2, username: "user-2" });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ id: commentId1 });
      await CommentsTableTestHelper.addComment({ id: commentId2 });
      await CommentLikesTableTestHelper.likeComment({ commentId: commentId1, userId: userId1 });
      await CommentLikesTableTestHelper.likeComment({ commentId: commentId1, userId: userId2 });
      await CommentLikesTableTestHelper.likeComment({ commentId: commentId2, userId: userId1 });

      // Action
      const likesCount = await commentLikeRepository.getLikesCountByCommentIds([commentId1, commentId2]);

      // Assert
      expect(likesCount).toEqual([
        // eslint-disable-next-line camelcase
        { comment_id: commentId1, count: 2 },
        // eslint-disable-next-line camelcase
        { comment_id: commentId2, count: 1 },
      ]);
    });
  });
});