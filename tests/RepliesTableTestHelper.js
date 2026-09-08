/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool';

const RepliesTabletestHelper = {
  async addReplies({
    id = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f94',
    content = 'sebuah balasan',
    isDeleted = false,
    commentId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93',
    userId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91',
  }) {
    const query = {
      text: 'INSERT INTO replies(id, content, is_deleted, comment_id, user_id) VALUES($1, $2, $3, $4, $5)',
      values: [id, content, isDeleted, commentId, userId],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

export default RepliesTabletestHelper;
