const { Thought, User } = require('../models');

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get a user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Create a user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Delete a user
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });
      console.log(user.friends[0].valueOf());
      if (!user) {
        res.status(404).json({ message: 'No user with that ID' });
      }

      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      for (let i=0; i<user.friends.length; i++){
        const friend = await User.findOneAndUpdate(
          { _id: user.friends[i].valueOf() },
          { $pull: { friends: user._id } },
          { runValidators: true, new: true }
        );
        if (!friend) {
          res.status(404).json({ message: 'error deleting friend\'s freinds array'});
        } 
        // with this current schema, I am unsure how to delete a user's reactions
          res.json({ message: 'User and Thoughts deleted, Friendships removed' });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Update a user
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      // update the username on any thoughts they may have.  Unsure how to update usernames on reactions
      if(req.body.username){
        for (let i=0; i<user.thoughts.length; i++){  
          const thought = await Thought.findOneAndUpdate(
            { _id: user.thoughts[i].valueOf() },
            { $set: { username: user.username } },
            { runValidators: true, new: true }
          );
        }
      }
      if (!user) {
        res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // add friendship - add friend to user friendlist and user to friend friendlist
  async addFriendship(req, res) {
    try {
      // add friendId to user's friends
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );
     // add userId to friend's friends
      const friend = await User.findOneAndUpdate(
        { _id: req.params.friendId },
        { $addToSet: { friends: req.params.userId } },
        { runValidators: true, new: true }
      );
      if (!user) {
        res.status(404).json({ message: 'No user with this id!' });
      }
      if (!friend) {
        res.status(404).json({ message: "No friend found with that id!"});
      }
      res.json({ user , friend});
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // delete a friendship from both parties: user and friend
  async removeFriendship(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId  } },
        { runValidators: true, new: true }
      );
      const friend = await User.findOneAndUpdate(
        { _id: req.params.friendId },
        { $pull: { friends: req.params.userId } },
        { runVaildators: true, new: true }
      );
      if (!user) {
        res.status(404).json({ message: 'No user with this id!' });
      }
      if (!friend) {
        res.status(404).json({ message: "No friend found with that id!"});
      }
      res.json({ user, friend });
    } catch (err) {
      res.status(500).json(err);
      console.error(err);
    }
  },
};
