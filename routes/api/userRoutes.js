const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriendship,
  removeFriendship,
} = require('../../controllers/userController.js');

router.route('/').get(getUsers).post(createUser);

router
  .route('/:userId')
  .get(getSingleUser)
  .put(updateUser)
  .delete(deleteUser);

  // /api/thoughts/:thoughtId/reactions
router.route('/:userId/friends/:friendId').post(addFriendship).delete(removeFriendship);

module.exports = router;