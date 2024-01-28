const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread', () => {
    it('should persist new thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const newThread = {
        title: 'this is thread title',
        body: 'this is thread body',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123';
      const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const { id, title, owner } = await repository.addThread(newThread);

      // Assert
      expect(id).toEqual('thread-123');
      expect(title).toEqual(newThread.title);
      expect(owner).toEqual(newThread.owner);

      const foundThread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(foundThread).toBeDefined();
      expect(foundThread.id).toEqual('thread-123');
      expect(foundThread.title).toEqual(newThread.title);
      expect(foundThread.owner).toEqual(newThread.owner);
      expect(foundThread.body).toEqual(newThread.body);
      expect(foundThread.date).toBeDefined();
    });
  });

  describe('isThreadExist', () => {
    it('should return true if thread exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const repository = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(repository.isThreadExist('thread-123')).resolves.toBe(true);
    });

    it('should returh false if thread not exists', async () => {
      // Arrange
      const repository = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(repository.isThreadExist('thread-123')).resolves.toBe(false);
    });
  });

  describe('getThreadById', () => {
    it('should return null if thread not exists', async () => {
      // Arrange
      const repository = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await repository.getThreadById('thread-123');

      // Assert
      expect(thread).toBeNull();
    });

    it('should return thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const repository = new ThreadRepositoryPostgres(pool, {});

      // Action
      const {
        id, title, body, date, username, comments,
      } = await repository.getThreadById('thread-123');

      // Assert
      expect(id).toEqual('thread-123');
      expect(title).toEqual('title');
      expect(body).toEqual('body');
      expect(date).toEqual(expect.any(String));
      expect(username).toEqual('bimantoro');
      expect(comments).toEqual([]);
    });
  });
});
