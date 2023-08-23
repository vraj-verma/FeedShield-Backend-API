/* eslint-disable prettier/prettier */
import * as joi from 'joi';
import { Status } from 'src/models/account.model';
import { Role } from 'src/models/signup.model';

export class JoiValidationSchema {
    static signupSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required().min(5).max(30),
        name: joi.string().optional().allow(null, ''),
        status: joi.valid(...Object.values(Status)).allow('', null),
    });

    static signinSchema = joi.object({
        email: joi.string().required(),
        password: joi.string().min(5).max(30).required()
    });

    static createUserSchema = joi.object({
        name: joi.string().optional().allow(null, ''),
        email: joi.string().email().required(),
        role: joi.valid(...Object.values(Role)),
        access: joi.boolean().optional().allow(null, ''),
    });

    static joinUserSchema = joi.object({
        password: joi.string().min(5).max(30).required(),
        confirm_password: joi.string().min(5).max(30).required()
    });

    static updateUserSchema = joi.object({
        name: joi.string().optional().allow(null, ''),
        role: joi.valid(...Object.values(Role)).optional().allow(null, ''),
        status: joi.valid(...Object.values(Status)).optional().allow(null, ''),
        access: joi.boolean().optional().allow(null, ''),
    });

    static createFeedSchema = joi.object({
        name: joi.string().required(),
        description: joi.string().required(),
        url: joi.string().uri().required()
    });

    static updateFeedSchema = joi.object({
        name: joi.string().optional().allow(null, ''),
        description: joi.string().optional().allow(null, ''),
        url: joi.string().uri().optional().allow(null, '')
    });

}