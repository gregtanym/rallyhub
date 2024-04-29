import mongoose from 'mongoose';

const ClubSchema = new mongoose.Schema({
  clubName: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  }
});

const Club = mongoose.models.Club || mongoose.model('Club', ClubSchema, 'clubs');

export default Club;