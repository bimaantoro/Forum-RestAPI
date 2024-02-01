/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const { rows } = await pool.query(query);
    return rows[0];
  },

  async addReply({
    id = 'reply-123', commentId = 'comment-123', content = 'some reply', userId = 'user-123', isDelete = false,
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, content, userId, commentId, isDelete, new Date().toISOString()],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE TRUE');
  },
};

module.exports = RepliesTableTestHelper;
