const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/userController');

router.post('/capture', createUser);

module.exports = router;
