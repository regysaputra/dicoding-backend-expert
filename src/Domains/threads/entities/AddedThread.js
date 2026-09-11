export default class AddedThread {
  constructor(payload) {
    this.#verify(payload);

    const {
      id, title, userId,
    } = payload;

    this.id = id;
    this.title = title;
    this.userId = userId;
  }

  #verify({
    id, title, userId,
  }) {
    if (!id || !title || !userId) {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id) || typeof title !== 'string' || !uuidRegex.test(userId)) {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}