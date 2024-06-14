import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    aiKeyUsage: { type: Number, default: 3 },
});

export default mongoose.models.User || mongoose.model('User', userSchema);