import AddedReply from '../AddedReply';

describe('AddedReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new AddedReply(payload)).toThrow('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'reply',
      userId: 'user-123',
    };

    // Action & Assert
    expect(() => new AddedReply(payload)).toThrow('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedReply object correctly', () => {
    // Arrange
    const payload = {
      id: '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91',
      content: 'reply',
      userId: '01890f2f-7b6e-7c2a-9f4b-3d8a1e2c4f90',
    };

    // Action
    const addedReply = new AddedReply(payload);

    // Assert
    expect(addedReply).toBeInstanceOf(AddedReply);
    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.userId).toEqual(payload.userId);
  });
});
