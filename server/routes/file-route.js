const express = require('express');
const router = express.Router();
const { getFileInfo, addFile, delFile, getMqttMessages, clearMqttMessages, testbd, saveRecord, startRecord, stopRecord, cancelRecord } = require('../controllers/file-controller');

router.get('/getFileInfo', getFileInfo);
router.delete('/delFile', delFile);
router.delete('/clearMqttMessages', clearMqttMessages);
router.post('/testbd', testbd);

router.post('/startRecord', startRecord)
router.post('/stopRecord', stopRecord)
router.post('/saveRecord', saveRecord)
router.post('/cancelRecord', cancelRecord)


module.exports = router;