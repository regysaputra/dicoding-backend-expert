import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddThread from '../../../Domains/threads/entities/AddThread.js';
import AddedThread from '../../../Domains/threads/entities/AddedThread.js';
import AddThreadUseCase from '../AddThreadUseCase.js';
import { jest } from '@jest/globals';

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const id = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f92';
    const userId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91';
    const useCasePayload = {
      title: 'Thread Title',
      body: 'content',
    };

    const mockAddedThread = new AddedThread({
      id: '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f92',
      title: useCasePayload.title,
      userId: '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91',
    });

    /** creating dependencies of a use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking the necessary function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    /** create a use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload, id, userId);

    // Assert
    expect(addedThread).toEqual(new AddedThread({
      id: id,
      title: useCasePayload.title,
      userId: userId,
    }));
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }, id, userId));
  });
});
