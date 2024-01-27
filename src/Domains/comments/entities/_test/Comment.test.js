const Comment = require('../Comment');

describe('Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'bimantoro',
      content: 'dummy content',
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: true,
      content: {},
      date: [],
      isDelete: 'true',
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'bimantoro',
      date: 'date-123',
      content: '**komentar telah dihapus**',
      isDelete: true,
    };

    // Action
    const {
      id, username, date, content, isDelete,
    } = new Comment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
    expect(isDelete).toEqual(payload.isDelete);
  });
});
