const User = require('../models/user.model');
const fs = require('fs');
const path = require('path');
const twilio = require('twilio');

const postLogin = async (req, res) => {
    const { mobile, password } = req.body;

    try {
        const user = await User.findOne({ mobile, password });
        if (!user) {
            return res.status(404).send('User not found');
        }
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send('Server error: ' + error.message);
    }
};

const postRegister = async (req, res) => {
    const { name, password, licenseID, mobile, designation } = req.body;
    
    const user = new User({
        licenseID,
        name,
        mobile,
        password,
        designation,
        // Uncomment if you want to handle file uploads
        // file: req.file ? { contentType: req.file.mimetype, image: fs.readFileSync(req.file.path).toString('base64') } : undefined
    });

    try {
        const savedUser = await user.save();
        
        // Uncomment to send SMS after registration
        // await sendSms(mobile);

        return res.status(200).send(savedUser);
    } catch (error) {
        return res.status(400).send('Error: ' + error.message);
    }
};


const getDocument = async (req, res) => {
    try {
        const user = await User.findOne({ licenseID: req.params.id });
        if (!user) {
            return res.status(404).send('User not found');
        }
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send('Server error: ' + error.message);
    }
};

module.exports = {
    postLogin,
    postRegister,
    getDocument
};
