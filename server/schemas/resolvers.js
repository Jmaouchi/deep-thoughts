const { User, Thought } = require('../models');

// Resolvers do work in a similar fashion to how a controller file works 
const resolvers = {
  // a query can only retrieve data from the database
  Query: {
    // get all users
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    },

    // get a user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    },

    // get the thoughts query from the typeDefs
    thoughts: async (parent, {username}) => {
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },

    // get a single user by id
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    },
    
  }
};

module.exports = resolvers;