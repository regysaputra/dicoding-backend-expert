/* eslint-disable camelcase */
class GetAllThreadUseCase {
  #threadRepository;

  #commentRepository;

  #replyRepository;
  
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this.#threadRepository = threadRepository;
    this.#commentRepository = commentRepository;
    this.#replyRepository = replyRepository;
  }

  async #transform(threads) {
    const results = [];

    for(const thread of threads) {
      const {
        thread_id,
        thread_title,
        thread_body,
        thread_date,
        user_username
      } = thread;

      let totalDiscussion = 0;
      const comments = await this.#commentRepository.getCommentsByThreadId(thread_id);
      totalDiscussion += comments.length;
      
      for (const comment of comments) {
        const totalReply = await this.#replyRepository.getTotalReplyByCommentId(comment.comment_id);

        totalDiscussion += Number(totalReply);
      }

      results.push({
        id: thread_id, title: thread_title, body: thread_body, date: thread_date, username: user_username, total_discussion: totalDiscussion
      });
    }

    return results;
  }

  async execute() {
    // Get all threads from the repository
    const threads = await this.#threadRepository.getAllThread();

    // Transform the threads to include total discussion count
    return this.#transform(threads);
  }
}

export default GetAllThreadUseCase;
