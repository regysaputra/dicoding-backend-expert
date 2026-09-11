/* eslint-disable camelcase */
/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("comment_likes", {
    comment_id: {
      type: "uuid",
      references: "comments",
      notNull: true,
    },
    user_id: {
      type: "uuid",
      references: "users",
      notNull: true,
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.addConstraint("comment_likes", "comment_likes_unique_comment_user", {
    unique: ["comment_id", "user_id"],
  });
  pgm.createIndex("comment_likes", "comment_id");
  pgm.createIndex("comment_likes", "user_id");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("comment_likes");
};
