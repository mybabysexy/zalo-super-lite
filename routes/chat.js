var express = require('express');
var router = express.Router();

/* GET friend listing. */
router.get('/', function (req, res, next) {
    res.render('chat-list')
});
router.get('/:threadId', function (req, res, next) {
    res.render('chat-detail', {
        threadId: req.params.threadId
    })
});

module.exports = router;
