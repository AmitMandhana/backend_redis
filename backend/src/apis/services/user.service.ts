import User from '../../models/User'; 


export async function createUserService(email: string, name: string, provider: string, avatarUrl: string, googleId?: string) {
    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            // Update existing user if needed
            if (googleId && !existingUser.googleId) {
                existingUser.googleId = googleId;
                await existingUser.save();
            }
            return existingUser;
        }
      
        const user = new User({
            email,
            name,
            provider,
            avatarUrl,
            googleId: googleId || undefined,
        });

        const savedUser = await user.save();
        return savedUser;
    } catch (error) {
        console.error("Error creating user:", error);
        return null;
    }
}

export async function getUserByEmailService(email: string) {
    const user = await User.findOne({ email: email });
    if (!user) {
        return null;
    }
    return user;
}