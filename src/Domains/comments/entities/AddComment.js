export default class AddComment {
  constructor(payload, threadId, userId) {
    this.#verifyPayload(payload);
    const { content } = payload;

    this.content = content;
    this.threadId = threadId;
    this.userId = userId;
  }

  // eslint-disable-next-line class-methods-use-this
  #verifyPayload({ content }) {
    if (!content) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
