/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool';

const CommentsTableTestHelper = {
  async addComment({
    id = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93',
    content = 'sebuah komentar',
    isDelete = false,
    threadId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f92',
    userId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91',
  }) {
    const query = {
      text: 'INSERT INTO comments(id, content, is_deleted, thread_id, user_id) VALUES($1, $2, $3, $4, $5)',
      values: [id, content, isDelete, threadId, userId],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

export default CommentsTableTestHelper;