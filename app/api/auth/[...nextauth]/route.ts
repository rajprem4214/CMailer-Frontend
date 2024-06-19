import SignToken from "@/app/SignToken";
import dbConnect from "@/lib/DBConnection";
import UserModel from "@/lib/models/UserModel";
import { NextAuthOptions } from "next-auth";
import NextAuth, { getServerSession } from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { Session } from "next-auth";

interface ExtendedSession extends Session {
    loggedUser: any; // Replace 'any' with the type of loggedUser
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    providers: [
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async signIn({ account, profile }) {
            try {
                await dbConnect();

                if (!profile) {
                    console.error('Profile is undefined');
                    return false;
                }

                const { email, name } = profile;

                // Check if the user already exists in the database
                let existingUser = await UserModel.findOne({ email });

                if (!existingUser) {
                    // If the user doesn't exist, create a new record
                    existingUser = await UserModel.create({ name, email, aiKeyUsage: 0 });
                } else {
                    // If the user exists, update the record
                    existingUser.name = name;
                    existingUser.email = email;
                    await existingUser.save();
                }

                return true;
            } catch (error) {
                console.error('Error signing in:', error);
                return false;
            }
        },
        async jwt({ token, user, account }) {
            if (account) {
                const userLoggedIn = await SignToken(user?.email as string);
                token.loggedUser = userLoggedIn;
            }
            return token;
        },
        async session({ session, token, user }) {
            (session as ExtendedSession).loggedUser = token.loggedUser;
            return session;
        },
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

