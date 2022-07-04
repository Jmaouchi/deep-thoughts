const { User, Thought } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');


// Resolvers do work in a similar fashion to how a controller file works 
const resolvers = {
  // a query can only retrieve data from the database
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('thoughts')
          .populate('friends');

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },

    // get all users
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    },

    // get a user by username, we beed the username here because if you check the typeDefs queries you will see that the query for user has a username as a 
    //params that need to be defined to get the data back
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    },

    // get the thoughts query from the typeDefs
    thoughts: async (parent, {username}) => {
      const params = username ? { username } : {}; // if there is a username return then find the tought that match that username, if not retun an empty object
      return Thought.find(params).sort({ createdAt: -1 }); // the reason why we returning thought.find not findOne is that the username is not unique, we can have many with same username
    },

    // get a single user by id
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    },
    
  },


  // mutations to post, delete and update the database
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
    
      return { token, user };
    },

    // login mutation
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
    
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }
    
      const correctPw = await user.isCorrectPassword(password);
    
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
    
      const token = signToken(user);
      return { token, user };
    },
    

    // thoughts mutation
    addThought: async (parent, args, context) => {
      // first we need to check if the user in logged-in
      if (context.user) {
        // if the user is logged-in then create the thought using on the user platform, so with that the thought will belong to the user 
        const thought = await Thought.create({ ...args, username: context.user.username });
    
        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { thoughts: thought._id } },
          { new: true }
        );
    
        return thought;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    },

    //reactions mutation
    addReaction: async (parent, { thoughtId, reactionBody }, context) => {
      if (context.user) {
        const updatedThought = await Thought.findOneAndUpdate(
          { _id: thoughtId },
          { $push: { reactions: { reactionBody, username: context.user.username } } },
          { new: true, runValidators: true }
        );
    
        return updatedThought;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    },

    // addFriend mutation
    addFriend: async (parent, { friendId }, context) => {
      if (context.user) {
        const updatedThought = await User.findOneAndUpdate(
          { _id: thoughtId },
          { $push: { friends: { friends: friendId} } },
          { new: true, runValidators: true }
        ).populate('friends')
    
        return addFriend;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    }
  }
  
};

module.exports = resolvers;