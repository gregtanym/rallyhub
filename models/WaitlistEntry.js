import { Schema, model, models } from 'mongoose';

const WaitlistEntrySchema = new Schema({
  email: {
    type: String,
    unique: [true, 'Email already exists!'],
    required: [true, 'Email is required!'],
  },
  area: {
    type: String,
    required: [true, 'Area is required!'],
  }
});

const WaitlistEntry = models.WaitlistEntry || model("WaitlistEntry", WaitlistEntrySchema);

export default WaitlistEntry;