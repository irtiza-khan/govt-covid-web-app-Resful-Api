const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//creating a user schema ;

const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true

    },

    status: {
        type: String,
        default: 'inactive'
    }
})



const User = mongoose.model('User', userSchema);

module.exports = User;