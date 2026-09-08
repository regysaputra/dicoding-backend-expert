/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js';

const DatabaseTestHelper = {
  async cleanAllTables() {
    await pool.query(`
      TRUNCATE TABLE
        replies,
        comments,
        threads,
        authentications,
        users
      RESTART IDENTITY CASCADE
    `);
  },
};

export default DatabaseTestHelper;