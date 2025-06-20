var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function (req, res, next) {
    res.status(404).render('error', { message: 'Not found', error: { status: 404, stack: '' } });
});

router.get('/health', function (req, res, next) {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
    });
});

router.get('/login', function (req, res, next) {
    const errorMessage = req.query.error || '';
    res.render('login', {
        errorMessage: errorMessage
    });
});

router.post('/login', function (req, res, next) {
    const token = req.body.token || '';
    if (!token) {
        return res.redirect('/login?error=Token is required');
    }
    res.redirect('/checkpoint');
});

router.get('/checkpoint', function (req, res, next) {
    const hasQr = fs.existsSync('./public/images/qr.png');
    if (hasQr) {
        res.render('checkpoint', {
            qrPath: '/images/qr.png',
        });
    } else {
        res.redirect('/chat');
    }
});

module.exports = router;
