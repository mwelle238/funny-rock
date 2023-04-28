const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v');
      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' })
      }
      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { username: thought.username },
        { $addToSet: { thoughts: thought._id.valueOf() } },
        { runValidators: true, new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "No user with username found"})
      }
      res.json({thought, user});
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a thought and remove them from the course
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });
      const user = await User.findOneAndUpdate(
        { username: thought.username },
        { $pull: { thoughts: req.params.thoughtId } },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'No such thought exists' });
      }
      if (!user) {
        return res.status(404).json({ message: 'No user with username associated with this thought found'});
      }
      res.json({ message: 'Thought successfully deleted', thought, user });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async updateThought(req, res) {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { thoughtText: req.body.thoughtText }, // only allow updating of thought text
            { runValidators: true, new: true },
        );
        if (!thought) {
            return res.status(404).json({ message: 'no such thought exists'});
        }
        res.json(thought);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
  },

  // Add an assignment to a thought
  async addReaction(req, res) {
    console.log('You are adding a reaction');
    console.log(req.body);

    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res
          .status(404)
          .json({ message: 'No thought found with that ID :(' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Remove reaction from a thought
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res
          .status(404)
          .json({ message: 'No thought found with that ID :(' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
