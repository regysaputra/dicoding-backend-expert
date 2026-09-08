import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import ReplyRepository from '../../Domains/replies/ReplyRepository.js';
import AddedReply from '../../Domains/replies/entities/AddedReply.js';

export default class ReplyRepositoryPostgres extends ReplyRepository {
  #pool;

  #idGenerator;

  constructor(pool, idGenerator) {
    super();
    this.#pool = pool;
    this.#idGenerator = idGenerator;
  }

  // @ts-ignore
  async addReply({ content, commentId, userId }) {
    const id = this.#idGenerator();

    const query = {
      text: 'INSERT INTO replies(id, content, comment_id, user_id) VALUES($1, $2, $3, $4) RETURNING id, content, user_id AS "userId"',
      values: [id, content, commentId, userId],
    };

    const result = await this.#pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Reply tidak ditemukan');
    }

    return result.rows[0];
  }

  async getRepliesByCommentIds(ids) {
    const query = {
      text: `
        SELECT 
            replies.id, content, is_deleted, username, comment_id, created_at
        FROM replies 
        LEFT JOIN users 
        ON replies.user_id = users.id 
        WHERE comment_id = ANY($1::uuid[]) 
        ORDER BY created_at ASC`,
      values: [ids],
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      return [];
    }

    return result.rows;
  }

  async deleteReply(id) {
    const query = {
      text: 'UPDATE replies SET is_deleted = true WHERE id = $1',
      values: [id],
    };

    await this.#pool.query(query);
  }

  async getTotalReplyByCommentId(commentId) {
    const query = {
      text: 'SELECT COUNT(id) FROM replies WHERE comment_id = $1',
      values: [commentId]
    };

    const totalReply = await this.#pool.query(query);

    return totalReply.rows[0].count;
  }
}