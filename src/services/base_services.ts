import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
require('dotenv').config();

export abstract class Services {
    protected randomInt(): number {
        const min: number = 100000;
        const max: number = 999999;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /**
     * Hash Password Method
     * @param {string} password
     * @returns {string} returns hashed password
     */
    protected hashPassword(password: string): string {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
    };

    /**
     * comparePassword
     * @param {string} hashPassword 
     * @param {string} password 
     * @returns {Boolean} return True or False
     */
    protected comparePassword(hashPassword: string, password: string): boolean {
        return bcrypt.compareSync(password, hashPassword);
    };

    /**
     * isValidEmail helper method
     * @param {string} email
     * @returns {Boolean} True or False
     */
    protected isValidEmail(email: string): boolean {
        return /\S+@\S+\.\S+/.test(email);
    };

    /**
     * Gnerate Token
     * @param {string} id
     * @returns {string} token
     */
    protected generateToken(id: number): string {
        const token = jwt.sign({ userId: id }, <string>process.env.SECRET, { expiresIn: '7d' });
        return token;
    }
}