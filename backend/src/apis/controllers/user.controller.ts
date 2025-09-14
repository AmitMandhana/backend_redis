import { Request, Response } from 'express';
import { error, success } from '../../utils/response';
import { createUserService, getUserByEmailService } from '../services/user.service';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function createUser(req: Request, res: Response): Promise<void> {
    try {
        const { token } = req.body;
        if (!token) {
            res.status(400).json(error("Token is required", 400));
            return;
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID, 
        });

        if(!ticket){
            res.status(401).json(error("Invalid token", 401));
            return;
        }  
        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            res.status(401).json(error("Invalid token", 401));
            return;
        }
        const { name, email, picture: avatarUrl, sub: googleId } = payload;
     
        const provider = 'google';
        const newUser = await createUserService(email, name as string, provider, avatarUrl as string, googleId);

        res.status(201).json(success({
            message: "User LoggedIn successfully",
            user : newUser
        }, 201));
    } catch (err) {
        console.error('Error in createUser:', err);
        res.status(500).json(error("Internal server error", 500));
    }
}

export async function getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
        const { email } = req.query;
        console.log(email);
        if (!email) {
            res.status(400).json(error("Email is required", 400));
            return;
        }
        const user = await getUserByEmailService(email as string);
        if(!user){
            res.status(404).json(error("User not found", 404));
            return;
        }
        res.status(200).json(success({
            message: "User fetched successfully",
            user : user
        }, 200));
    } catch (err) {
        console.error('Error in getUserByEmail:', err);
        res.status(500).json(error("Internal server error", 500));
    }
}