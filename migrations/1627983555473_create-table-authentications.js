

export const up = (pgm) => {
  pgm.createTable('authentications', {
    token: {
      type: 'TEXT',
      notNull: true,
    },
  });

  pgm.createIndex('authentications', 'token', { unique: true });
};

export const down = (pgm) => {
  pgm.dropTable('authentications');
};
