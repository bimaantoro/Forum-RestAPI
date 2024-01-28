const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComent({
    id = 'comment-123', threadId = 'thread-123', content = 'some comment', userId = 'user-123', isDelete = false,
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, content, userId, threadId, isDelete, new Date().toISOString()],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const { rows } = await pool.query(query);
    return rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE true');
  },
};

module.exports = CommentsTableTestHelper;
