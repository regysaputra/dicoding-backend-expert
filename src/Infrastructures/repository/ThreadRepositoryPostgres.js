import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import ThreadRepository from '../../Domains/threads/ThreadRepository.js';
import AddedThread from '../../Domains/threads/entities/AddedThread.js';

export default class ThreadRepositoryPostgres extends ThreadRepository {
  #pool;
  #idGenerator;

  constructor(pool, idGenerator) {
    super();
    this.#pool = pool;
    this.#idGenerator = idGenerator;
  }

  // @ts-ignore
  async addThread({ title, body, userId }) {
    const id = this.#idGenerator();

    const query = {
      text: 'INSERT INTO threads(id, title, body, user_id) VALUES($1, $2, $3, $4) RETURNING id, title, user_id AS "userId"',
      values: [id, title, body, userId],
    };

    const result = await this.#pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async verifyThreadAvailability(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
  }

  // @ts-ignore
  async getThreadById(id) {
    const query = {
      text: `
        SELECT 
            t.id, title, body, username, created_at
        FROM threads t 
        JOIN users u ON t.user_id = u.id 
        WHERE t.id = $1`,
      values: [id],
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }

    return result.rows[0];
  }

  async getAllThread() {
    const query = {
      text: `
        SELECT 
            t.id, title, body, username, created_at
        FROM threads t
        JOIN users u ON t.user_id = u.id
      `,
      values: []
    };

    const results = await this.#pool.query(query);

    return results.rows;
  }
}