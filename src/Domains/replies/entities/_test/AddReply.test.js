import AddReply from '../AddReply';

describe('AddReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};
    const commentId = 'comment-123';
    const userId = 'user-123';

    // Action & Assert
    expect(() => new AddReply(payload, commentId, userId)).toThrow('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
    };
    const id = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91';
    const commentId = 'comment-123';
    const userId = 'user-123';

    // Action & Assert
    expect(() => new AddReply(payload, commentId, userId)).toThrow('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'reply',
    };
    const id = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91';
    const commentId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f92';
    const userId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93';

    // Action
    const addReply = new AddReply(payload, commentId, userId);

    // Assert
    expect(addReply).toBeInstanceOf(AddReply);
    expect(addReply.content).toEqual(payload.content);
    expect(addReply.commentId).toEqual(commentId);
    expect(addReply.userId).toEqual(userId);
  });
});
