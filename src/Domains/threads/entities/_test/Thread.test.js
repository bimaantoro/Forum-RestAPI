const Thread = require('../Thread');

describe('Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'dummy title',
      body: 'dummy body',
      date: 'dummy date',
    };

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: {},
      body: [],
      date: false,
      username: true,
    };

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  // it('should create addedThread object correctly', () => {
  //   // Arrange
  //   const payload = {
  //     id: 'thread-123',
  //     title: 'dummy title',
  //     owner: 'user-123',
  //   };

  //   // Action
  //   const { id, title, owner } = new AddedThread(payload);

  //   // Assert
  //   expect(id).toEqual(payload.id);
  //   expect(title).toEqual(payload.title);
  //   expect(owner).toEqual(payload.owner);
  // });
});
