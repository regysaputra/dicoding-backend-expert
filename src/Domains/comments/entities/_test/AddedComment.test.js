import AddedComment from '../AddedComment';

describe('AddedComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f93',
      userId: '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f92',
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrow('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 123,
      userId: 'user-123',
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrow('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedComment object correctly', () => {
    // Arrange
    const payload = {
      id: '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f91',
      content: 'comment',
      userId: '01890f2f-7b6e-7a2a-8f4b-3d8a1e2c4f92',
    };

    // Action
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment).toBeInstanceOf(AddedComment);
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.userId).toEqual(payload.userId);
  });
});
