export default class AddReply {
  constructor(payload, commentId, userId) {
    this.#verifyPayload(payload);

    const { content } = payload;

    this.content = content;
    this.commentId = commentId;
    this.userId = userId;
  }

  #verifyPayload({ content }) {
    if (!content) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}