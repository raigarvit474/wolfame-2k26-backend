const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { isEmail, isURL, isMobilePhone } = require('validator');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true
    },
    linkedin: {
        type: String,
        trim: true,
    },
    phone_number: {
        type: String,
        trim: true,
    },
    residence: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.toJSON = function () {
    const userObject = this.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.PRIVATE_KEY)
    this.tokens = this.tokens.concat({ token })
    await this.save()
    return token
}

userSchema.statics.findByCredentials = async (user_credentials, password) => {
    const user = await User.findOne(user_credentials)
    if (user && await bcrypt.compare(password, user.password)) {
        return user
    }
    throw { msg: 'Unable to Signin' }
}

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User