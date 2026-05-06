const express = require('express');
const router = express.Router();
const { createAudit, attachEmail, getAudit } = require('../controllers/auditController');

router.post('/create', createAudit);
router.post('/email', attachEmail);
router.get('/:id', getAudit);

module.exports = router;
