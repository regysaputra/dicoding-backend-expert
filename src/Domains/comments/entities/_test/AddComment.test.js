import AddComment from '../AddComment';

describe('AddComment entities', () => {
  it('should throw error when payload not contain needed property or when userid', () => {
    // Arrange
    const payload = {};
    const threadId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91';
    const userId = '01890f2f-7b6e-7d2a-bf4b-3d8a1e2c4f92';

    // Action & Assert
    expect(() => new AddComment(payload, threadId, userId)).toThrow('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
    };
    const threadId = 'thread-123';
    const userId = 'user-123';

    // Action & Assert
    expect(() => new AddComment(payload, threadId, userId)).toThrow('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'comment',
    };
    const threadId = '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91';
    const userId = '01890f2f-7b6e-7d2a-bf4b-3d8a1e2c4f92';

    // Action
    const addComment = new AddComment(payload, threadId, userId);

    // Assert
    expect(addComment).toBeInstanceOf(AddComment);
    expect(addComment.content).toEqual(payload.content);
    expect(addComment.threadId).toEqual(threadId);
    expect(addComment.userId).toEqual(userId);
  });
});
