const router = require('express').Router();

router.use('/spot', require('./spot'));
router.use('/weather', require('./weather'));

module.exports = router;
