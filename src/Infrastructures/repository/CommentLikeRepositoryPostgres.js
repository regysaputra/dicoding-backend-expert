export default class CommentLikeRepositoryPostgres {
  #pool;

  constructor(pool) {
    this.#pool = pool;
  }

  async likeComment(commentId, userId) {
    const query = {
      text: 'INSERT INTO comment_likes(comment_id, user_id) VALUES($1, $2)',
      values: [commentId, userId],
    };

    await this.#pool.query(query);
  }

  async unlikeComment(commentId, userId) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    await this.#pool.query(query);
  }

  async hasUserLikedComment(commentId, userId) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const result = await this.#pool.query(query);
    return result.rowCount > 0;
  }

  // Get bulk likes count for multiple comments by their IDs
  async getLikesCountByCommentIds(commentIds) {
    const query = {
      text: `
      SELECT comment_id, COUNT(*)::int AS count
      FROM comment_likes
      WHERE comment_id = ANY($1::uuid[])
      GROUP BY comment_id
    `,
      values: [commentIds],
    };

    const result = await this.#pool.query(query);
    return result.rows;
  }

  // Get the number of likes for a comment by its ID
  // async getLikesCountByCommentId(commentId) {
  //   const query = {
  //     text: 'SELECT COUNT(*) FROM comment_likes WHERE comment_id = $1 GROUP BY comment_id',
  //     values: [commentId],
  //   };
  //
  //   const result = await this.#pool.query(query);
  //   return parseInt(result.rows[0].count, 10);
  // }
}