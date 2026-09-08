class GetThreadUseCase {
  #threadRepository;

  #commentRepository;

  #replyRepository;

  constructor({ threadRepository, commentRepository, replyRepository }) {
    this.#threadRepository = threadRepository;
    this.#commentRepository = commentRepository;
    this.#replyRepository = replyRepository;
  }

  // eslint-disable-next-line class-methods-use-this
  async #transform(thread, comments, replies) {
    // Group reply by comment id
    const groupedReplies = {};

    for(const reply of replies) {
      if(!groupedReplies[reply.comment_id]) {
        groupedReplies[reply.comment_id] = [];
      }

      groupedReplies[reply.comment_id].push({
        id: reply.id,
        content: reply.is_deleted ? "**balasan telah dihapus**": reply.content,
        date: reply.created_at,
        username: reply.username,
      });
    }

    // Attach replies to each comment
    const finalComments = comments.map((comment) => {
      return {
        id: comment.id,
        content: comment.is_deleted ? "**komentar telah dihapus**": comment.content,
        date: comment.created_at,
        username: comment.username,
        replies: groupedReplies[comment.id] || [],
      }
    });

    // Attach comments to the thread
    return {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.created_at,
      username: thread.username,
      comments: finalComments,
    };
  }

  async execute(threadId) {
    const thread = await this.#threadRepository.getThreadById(threadId);
    const comments = await this.#commentRepository.getCommentsByThreadId(threadId);

    let replies = [];

    if(comments.length > 0) {
      const commentIds = comments.map((comment) => comment.id);

      replies = await this.#replyRepository.getRepliesByCommentIds(commentIds);
    }

    return this.#transform(thread, comments, replies);
  }
}

export default GetThreadUseCase;
