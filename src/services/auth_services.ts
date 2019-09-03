// src/usingDB/controllers/Helper.js
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
require('dotenv').config();

const Helper = {
    /**
     * Hash Password Method
     * @param {string} password
     * @returns {string} returns hashed password
     */
    hashPassword(password: string) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
    },
    /**
     * comparePassword
     * @param {string} hashPassword 
     * @param {string} password 
     * @returns {Boolean} return True or False
     */
    comparePassword(hashPassword: string, password: string) {
        return bcrypt.compareSync(password, hashPassword);
    },
    /**
     * isValidEmail helper method
     * @param {string} email
     * @returns {Boolean} True or False
     */
    isValidEmail(email: string) {
        return /\S+@\S+\.\S+/.test(email);
    },
    /**
     * Gnerate Token
     * @param {string} id
     * @returns {string} token
     */
    generateToken(id: number) {
        const token = jwt.sign({ userId: id }, <string>process.env.SECRET, { expiresIn: '7d' });
        return token;
    }
}

export default Helper;