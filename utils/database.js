import mongoose from "mongoose"

let isConnected = false

export const connectToDb = async () => {
	mongoose.set("strictQuery", true)
	if (isConnected) {
		return
	}
	try {
		await mongoose.connect(process.env.MONGO_DB_URI, {
			dbName: "share_prompt",
		})
		isConnected = true
	} catch (error) {
		console.error("Cannot connect to db", error)
	}
}
