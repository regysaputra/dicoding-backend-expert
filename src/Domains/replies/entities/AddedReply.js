export default class AddedReply {
  constructor(payload) {
    this.#verifyPayload(payload);

    const { id, content, userId } = payload;

    this.id = id;
    this.content = content;
    this.userId = userId;
  }

  // eslint-disable-next-line class-methods-use-this
  #verifyPayload({ id, content, userId }) {
    if (!id || !content || !userId) {
      throw new Error('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id) || typeof content !== 'string' || !uuidRegex.test(userId)) {
      throw new Error('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}