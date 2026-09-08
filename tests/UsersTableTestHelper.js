/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js';

const UsersTableTestHelper = {
  async addUser({
    id = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91', username = 'dicoding', password = 'secret', fullname = 'Dicoding Indonesia',
  }) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: [id, username, password, fullname],
    };

    await pool.query(query);
  },

  async findUsersById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM users WHERE 1=1');
  },
};

export default UsersTableTestHelper;
