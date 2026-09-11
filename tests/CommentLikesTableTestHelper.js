/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool';

const CommentLikesTableTestHelper = {
  async likeComment({
                     commentId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93',
                     userId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91',
                   }) {
    const query = {
      text: 'INSERT INTO comment_likes(comment_id, user_id) VALUES($1, $2)',
      values: [commentId, userId],
    };

    await pool.query(query);
  },

  async unlikeComment({
                        commentId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93',
                        userId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91',
                      }){
    const query = {
      text: 'DELETE FROM comment_likes WHERE $1, $2',
      values: [commentId, userId],
    };

    await pool.query(query);
  },

  async findCommentByCommentAndUserId(commentId, userId) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_likes WHERE 1=1');
  },
};

export default CommentLikesTableTestHelper;