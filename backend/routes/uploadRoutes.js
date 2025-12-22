const express = require('express');
const router = express.Router();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { protect } = require('../middleware/authMiddleware');

const s3 = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// GET /api/upload/presigned-url?fileName=...&fileType=...
router.get('/presigned-url', protect, async (req, res) => {
    try {
        const { fileName, fileType } = req.query;
        if (!fileName || !fileType) {
            return res.status(400).json({ success: false, message: 'Missing file info' });
        }

        const key = `doctor-signatures/${req.user._id}-${Date.now()}-${fileName}`;
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            ContentType: fileType
        });

        const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
        const finalUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;

        res.json({ success: true, uploadUrl, finalUrl });
    } catch (error) {
        console.error("S3 Presign Error:", error);
        res.status(500).json({ success: false, message: 'Upload setup failed' });
    }
});

module.exports = router;
