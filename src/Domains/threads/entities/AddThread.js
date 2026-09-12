export default class AddThread {
  constructor(payload, userId) {
    this.#verifyPayload(payload);

    const { title, body } = payload;

    this.title = title;
    this.body = body;
    this.userId = userId;
  }

  #verifyPayload({ title, body }) {
    if (!title || !body) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}