/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool';

const ThreadsTableTestHelper = {
  async addThread({
    id = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f92',
    title = 'sebuah thread',
    body = 'sebuah body thread',
    userId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91',
  }) {
    const query = {
      text: 'INSERT INTO threads(id, title, body, user_id) VALUES($1, $2, $3, $4)',
      values: [id, title, body, userId],
    };

    await pool.query(query);
  },

  async verifyThreadAvailability(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

export default ThreadsTableTestHelper;
