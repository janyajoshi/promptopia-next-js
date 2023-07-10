import User from "@models/user"
import { connectToDb } from "@utils/database"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { signIn } from "next-auth/react"

// every next.js route is a serverless route
// serverless -> lambda
// everytime it makes a new connection to db

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],
	callbacks: {
		async session({ session }) {
			// store the user id from MongoDB to session
			const sessionUser = await User.findOne({ email: session.user.email })
			session.user.id = sessionUser._id.toString()

			return session
		},
		async signIn({ profile }) {
			let status = true
			try {
				await connectToDb()
				// check if already exists
				const userExists = await User.findOne({ email: profile.email })
				if (!userExists) {
					await User.create({
						email: profile.email,
						username: profile.name.replace(" ", "").toLowerCase(),
						image: profile.picture,
					})
				}
				// else create new
			} catch (error) {
				console.error("Cannot Authenticate User", error)
				status = false
			}
			return status
		},
	},
})

export { handler as GET, handler as POST }
