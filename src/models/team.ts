import mongoose from 'mongoose';

interface ITeam extends mongoose.Document{
    name: string
}

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Team = mongoose.model<ITeam>('team', teamSchema)

export { Team, ITeam }