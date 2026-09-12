/* eslint-disable camelcase */
/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("comments", {
    id: {
      type: "uuid",
      primaryKey: true,
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    is_deleted: {
      type: "BOOLEAN",
      notNull: true,
      default: false,
    },
    user_id: {
      type: "uuid",
      references: "users",
      notNull: true,
    },
    thread_id: {
      type: "uuid",
      references: "threads",
      notNull: true,
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    }
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("comments");
};
