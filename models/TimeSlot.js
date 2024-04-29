import { Schema, model, models } from 'mongoose';

const TimeSlotSchema = new Schema({
  club_id: {
    type: String, // References an ObjectId of a club
    required: true,
    ref: 'Club' // Establishes a reference to the Club model
  },
  date: String,
  startTime: String,
  endTime: String,
  status: String,
  capacity: Number,
  currentOccupancy: Number
});

const TimeSlot = models.TimeSlot || model('TimeSlot', TimeSlotSchema, 'club_timeslots');

export default TimeSlot;