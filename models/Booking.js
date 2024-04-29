import { Schema, model, models } from 'mongoose';

const BookingSchema = new Schema({
    timeslotIds: [{
        type: Schema.Types.ObjectId,
        ref: 'TimeSlot',
        required: true
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookingPax: {
        type: Number,
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now,
        required: true
    }
});

const Bookings = models.Bookings || model('Bookings', BookingSchema, 'bookings');

export default Bookings;