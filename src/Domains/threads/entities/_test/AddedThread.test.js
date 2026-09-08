import AddedThread from '../AddedThread';

describe('AddedThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'Thread Title',
    };

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'Thread Title',
      userId: 'user-123',
    };

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThread object correctly', () => {
    // Arrange
    const payload = {
      id: '01890f2f-7b6e-7e2a-9a4b-3d8a1e2c4f93',
      title: 'Thread Title',
      userId: '01890f2f-7b6e-7c2a-9f4b-3d8a1e2c4f90',
    };

    // Action
    const addedThread = new AddedThread(payload);

    // Assert
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.userId).toEqual(payload.userId);
  });
});
