const pool = require('../src/Infrastructures/database/postgres/pool');

/* istanbul ignore files */
const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123', title = 'title', body = 'body', owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, owner, new Date().toISOString()],
    };

    await pool.query(query);
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const { rows } = await pool.query(query);
    return rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE true');
  },
};

module.exports = ThreadsTableTestHelper;
