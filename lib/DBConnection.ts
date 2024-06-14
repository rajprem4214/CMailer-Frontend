import mongoose, { Mongoose } from 'mongoose';

let db: Mongoose;

async function dbConnect(): Promise<void> {
    if (db && db.connection.readyState === 1) {
        return;
    }


    db = await mongoose.connect(process.env.MONGODB_URI!, {
        useUnifiedTopology: true,
    } as any);
}

export default dbConnect;