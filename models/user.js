const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//This npm module simplifies the process of setting up user authentication using Passport.js with a local strategy. It automatically adds fields for username, hash, and salt, as well as methods for authenticating users.
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema ({
    email: {
        type: String,
        required : true,
        unique: true

    }
})

// This line applies the passportLocalMongoose plugin to the userSchema. 
// This plugin adds the following functionalities to the schema:
// Username and Password Fields: Adds fields for storing the username, hashed password, and salt value.
// Authentication Methods: Adds methods to the schema for user authentication, such as registering users, logging in, and checking passwords.
UserSchema.plugin(passportLocalMongoose)
//This line creates a Mongoose model named User using the userSchema and exports it.
module.exports = mongoose.model('User', UserSchema)
//By default, Mongoose converts the model name to lowercase and pluralizes it to form the collection name. So, 'User' becomes 'users'.