var express = require('express');

var router = express.Router();

// no route found
router.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
router.use((err, req, res, next) => {
    res.status(err.status || 500).send();
});

module.exports = router;