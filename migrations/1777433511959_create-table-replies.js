/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("replies", {
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
    },
    comment_id: {
      type: "uuid",
      references: "comments",
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("replies");
};
