import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import CommentRepository from '../../Domains/comments/CommentRepository.js';
import AddedComment from '../../Domains/comments/entities/AddedComment.js';

export default class CommentRepositoryPostgres extends CommentRepository {
  #pool;

  #idGenerator;

  constructor(pool, idGenerator) {
    super();
    this.#pool = pool;
    this.#idGenerator = idGenerator;
  }

  // @ts-ignore
  async addComment({ content, threadId, userId }) {
    const id = this.#idGenerator();

    const query = {
      text: 'INSERT INTO comments(id, content, thread_id, user_id) VALUES($1, $2, $3, $4) RETURNING id, content, user_id AS "userId"',
      values: [id, content, threadId, userId],
    };

    const result = await this.#pool.query(query);

    return new AddedComment({...result.rows[0]});
  }

  async verifyCommentAvailability(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND is_deleted = false',
      values: [id],
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
  }

  // @ts-ignore
  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND is_deleted = false',
      values: [id],
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }

    return result.rows[0];
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
        SELECT
            c.id, content, is_deleted, username, created_at
        FROM comments c JOIN users u ON c.user_id = u.id 
        WHERE c.thread_id = $1 
        ORDER BY created_at ASC`,
      values: [threadId],
    };

    const result = await this.#pool.query(query);
    if (!result.rowCount) {
      return [];
    }

    return result.rows;
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
      values: [id],
    };

    await this.#pool.query(query);
  }
}
