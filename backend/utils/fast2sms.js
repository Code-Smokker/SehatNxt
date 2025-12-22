const axios = require('axios');

const sendSms = async (phone, otp) => {
    try {
        const apiKey = process.env.FAST2SMS_API_KEY;
        if (!apiKey) {
            console.error('[Fast2SMS] API Key missing in environment variables');
            return { success: false, message: 'SMS Service Config Error' };
        }

        const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
            route: 'otp',
            variables_values: otp,
            numbers: phone,
            flash: 0
        }, {
            headers: {
                "authorization": apiKey
            }
        });

        console.log(`[Fast2SMS] Response for ${phone}:`, response.data);
        return { success: true, data: response.data };

    } catch (error) {
        console.error('[Fast2SMS] Error sending SMS:', error.response?.data || error.message);
        return { success: false, error: error.message };
    }
};

module.exports = sendSms;
