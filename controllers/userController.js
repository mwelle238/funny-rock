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

      if (!user) {
        res.status(404).json({ message: 'No user with that ID' });
      }

      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: 'User and thoughts deleted!' });
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

      if (!user) {
        res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async addFriendship(req, res) {
    try {
      // add friendId to user's friends
      const user = User.findOneAndUpdate(
        { _id: req.params.userID },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );
      // add userId to friend's friends
      const friend = User.findOneAndUpdate(
        { _id: req.params.friendId },
        { $addToSet: { friends: req.params.userId } },
        { runValidators: true, new: true }
      )

      if (!user) {
        res.status(404).json({ message: 'No user with this id!' });
      }
      if (!friend) {
        res.status(404).json({ message: "No friend found with that id!"});
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async removeFriendship(req, res) {
    try {
      const user = User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friend: { _id: req.params.friendId } } },
        { runValidators: true, new: true }
      );
      const friend = User.findOneAndUpdate(
        { _id: req.params.friendId },
        { $pull: { friend: { _id: req.params.userId } } },
        { runVaildators: true, new: true }
      );

      if (!user) {
        res.status(404).json({ message: 'No user with this id!' });
      }
      if (!friend) {
        res.status(404).json({ message: "No friend found with that id!"});
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
