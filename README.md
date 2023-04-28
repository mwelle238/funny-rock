# funny-rock
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
## Description

This back-end application handles a social media page that has users that share thoughts and reactions to those thoughts.

## Table of Contents

1. [Installation](#Installation)
2. [Usage](#Usage)
3. [Contributors](#Contributors)
4. [License](#License)
5. [Questions](#Questions)
6. [Walkthrough](#Walkthrough)

## Installation

After cloning the repository, run `npm i` followed by `npm run seed` followed by `npm start`.
This will start the server and you can use Insomnia to access the routes and interact with the data.

## Usage

Upon starting the server, you can use Insomnia to use the following routes:
`localhost:3001/api/users`
    - get: returns a list of all users
    - post: creates a new user - body requires "username" and "email" fields in the JSON object
`localhost:3001/api/users/:userId`
    - get: returns a specific user by userId
    - put: changes a field for the user - the field(s) to be changed are needed in the JSON object
        *put route also updates the "username" field of all thoughts the user had if their username has changed
    - delete: deletes the specific user and all thoughts and friendships they had.
`localhost:3001/api/users/:userId/friends/:friendId`
    - post: creates a new friendship between the users
    - delete: deletes the friendship between the users
`localhost:3001/api/thoughts`
    - get: returns a list of all thoughts
    - post: creates a new thought - body requires "thoughtText" and "username"
        *post route also updates the user with corresponding username to add the thought to their thought array
`localhost:3001/api/thoughts/:thoughtId`
    - get: returns a specific thought by thoughtId
    - put: changes a field for the user - only "thoughtText" is allowed to be updated currently
    - delete: deletes the specified thought and deletes the thought from the user that made it
`localhost:3001/api/thoughts/:thoughtId/reactions`
    - post: posts a reaction to the thought - "reactionBody" and "username" are required in the JSON object
`localhost:3001/api/thoughts/:thoughtId/reactions/:reactionId`
    - delete: deletes the specified reaction from the specified thought

## Contributors

This project was built by Michael Welle.
Resources used include node.js, npm, express, and mongoose

## License

MIT License

## Questions

Email: [michaelpwelle@gmail.com](mailto:michaelpwelle@gmail.com)

Github: [github.com/mwelle238](https://www.github.com/mwelle238)

## Walkthrough

[Video Link](https://watch.screencastify.com/v/6kJDcebNgODGIdDkOx3g)