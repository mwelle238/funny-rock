const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../../controllers/thoughtController.js');

// /api/courses
router.route('/').get(getUsers).post(createUser);

// /api/courses/:courseId
router
  .route('/:thoughtId')
  .get(getSingleUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;