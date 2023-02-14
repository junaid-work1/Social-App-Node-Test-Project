const express = require('express');
const { registerUser, deleteUser, getAllUser, getsingleUser, updateUser, logInUser } = require('../controllers/UserController');

const router = express.Router();

router.get('/v1/user-list', getAllUser)
router.get('/v1/getOne-User/:id', getsingleUser)
router.post('/v1/create-user', registerUser)
router.delete('/v1/delete-user/:id', deleteUser)
router.patch('/v1/update-user/:id', updateUser)

router.post('/v1/login-user', logInUser)

module.exports = router;