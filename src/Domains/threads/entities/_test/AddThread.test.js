import AddThread from '../AddThread';

describe('AddThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      body: 'content',
    };

    const userid = '01890f2f-7b6e-7c2a-9f4b-3d8a1e2c4f90';

    // Action & Assert
    expect(() => new AddThread(payload, userid)).toThrow('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: 'content'
    };

    const userid = '01890f2f-7b6e-7c2a-9f4b-3d8a1e2c4f90';

    // Action & Assert
    expect(() => new AddThread(payload, userid)).toThrow('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddThread entities correctly', () => {
    // Arrange
    const payload = {
      title: 'Thread Title',
      body: 'content',
    };

    const userId = '01890f2f-7b6e-7c2a-9f4b-3d8a1e2c4f91';

    // Action
    const addThread = new AddThread(payload, userId);

    // Assert
    expect(addThread).toBeInstanceOf(AddThread);
    expect(addThread.title).toEqual(payload.title);
    expect(addThread.body).toEqual(payload.body);
    expect(addThread.userId).toEqual(userId);
  });
});
