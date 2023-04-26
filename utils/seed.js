const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getUsernames, getThoughts, getReactions } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  // Drop existing data
  await User.deleteMany({});
  await Thought.deleteMany({});

  // Populate users
  const names = getUsernames();  //get list of usernames from data.js
  const users = [];  // create empty array to store the user objects
  for (let i = 0; i < names.length; i++) {
    const username = names[i]
    const email = `${username}@example.com`;  //add @example.com to the end of the username for their email field
    users.push({ username, email} );  //add the user to the array
  }
  // Add users and thoughts to the collections and await the results
  await User.collection.insertMany(users);
  // Populate thoughts
  const thoughtData = getThoughts(); //get list of thoughts from data.js
  for (let i= 0; i < thoughtData.length; i++){
    const username = names[Math.floor(Math.random()*names.length)];  // assign a random username to the thought
    const thoughtText = thoughtData[i];
    const thought = await Thought.create({ username, thoughtText });  // create thought
    // add thought to user's thought array
    const user = await User.findOneAndUpdate(
        { username: username },
        { $addToSet: { thoughts: thought._id } },
        { runValidators: true, new: true }
    );
  }
  
  // get all thoughts to randomly select reactions for
  const thoughts = await Thought.find();

  // Populate reactions
  const reactionData = getReactions();  // get list of reactions from data.js
  for(let i=0; i < reactionData.length; i++){
    const reactionBody = reactionData[i];
    const username = names[Math.floor(Math.random()*names.length)];  // assign a random username to the thought
    const thtId = thoughts[Math.floor(Math.random()*thoughts.length)]._id;  //gets random thought id
    // update the thought to add a reaction
    try {  
        const thought = await Thought.findOneAndUpdate(
          { _id: thtId },
          { $addToSet: { reactions: { reactionBody: reactionBody, username: username } } },
          { runValidators: true, new: true }
        );
        if (!thought) {
          console.error("couldn't find thought")
        }
    } catch (err) {
        console.error(err);
    }
  }
  // Populate friendships
  for(let i=0; i<20; i++) {
    const x = Math.floor(Math.random()*names.length);
    let y= x;
    do {
    y = Math.floor(Math.random()*names.length);
    } while ( x === y);  // don't want users to friend themselves
    try {
        // add friendId to user's friends
        const user = await User.findOneAndUpdate(
          { _id: users[x]._id.valueOf() },
          { $addToSet: { friends: users[y]._id.valueOf() } },
          { runValidators: true, new: true }
        );
        // add userId to friend's friends
        const friend = await User.findOneAndUpdate(
          { _id: users[y]._id.valueOf() },
          { $addToSet: { friends: users[x]._id.valueOf() } },
          { runValidators: true, new: true }
        )
  
        if (!user) {
          console.error('No user with this id!');
        }
        if (!friend) {
          console.error("No friend found with that id!");
        }  
    } catch (err) {
        console.error(err);
    } 
  }



  // Log out the seed data to indicate what should appear in the database
  console.table(users);
  console.table(thoughts);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
