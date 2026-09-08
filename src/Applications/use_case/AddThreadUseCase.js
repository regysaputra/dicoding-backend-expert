import AddThread from '../../Domains/threads/entities/AddThread.js';

class AddThreadUseCase {
  #threadRepository;

  constructor({ threadRepository }) {
    this.#threadRepository = threadRepository;
  }

  async execute(useCasePayload, userId) {
    const addThread = new AddThread(useCasePayload, userId);

    return this.#threadRepository.addThread(addThread);
  }
}

export default AddThreadUseCase;
