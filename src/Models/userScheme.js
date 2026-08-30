import mongoose from "mongoose";

const userScheme = new mongoose.Schema({
    userid: { type: string, required: true, unique: true },
    guildid: { type: string, required: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 }
});

export default mongoose.model("User", userScheme);