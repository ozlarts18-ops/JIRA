// MongoDB Mongoose Space Schema for Jira Spaces
export const spaceSchemaDefinition = {
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: 'Software space',
  },
  iconType: {
    type: String,
    enum: ['flask', 'robot', 'building'],
    default: 'flask',
  },
  members: [
    {
      initials: String,
      color: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
};
