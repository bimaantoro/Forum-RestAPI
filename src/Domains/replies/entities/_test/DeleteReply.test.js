const DeleteReply = require('../DeleteReply');

describe('DeleteReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
    };

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      owner: {},
      commentId: 123,
    };

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create deleteReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      owner: 'user-123',
      commentId: 'comment-123',
    };

    // Action
    const {
      id, owner, commentId,
    } = new DeleteReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.owner);
    expect(commentId).toEqual(payload.commentId);
  });
});
