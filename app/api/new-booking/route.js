// import { connectToDB } from "@utils/database";
// import Booking from "@models/Booking";
// import TimeSlot from "@models/TimeSlot";
// import User from "@models/user";

// export const POST = async (req) => {
//     const { timeslotIds, bookingPax, userId } = await req.json();

//     console.log(userId)
//     console.log("this is timeslot ids: ", timeslotIds)
//     console.log(bookingPax)

//     try {
//         await connectToDB()

//         // check capacity and update timeslots

//         for (const id in timeslotIds) {
//             const timeslot = await TimeSlot.findById(id);
//             if (!timeslot) {
//                 throw new Error("Timeslot not found");
//             }
//             if (timeslot.currentOccupancy + bookingPax > timeslot.capacity) {
//                 throw new Error("Not enough capacity");
//             }
//             timeslot.currentOccupancy += bookingPax;
//             if (timeslot.currentOccupancy === timeslot.capacity) {
//                 timeslot.status = 'booked';
//             }
//             await timeslot.save();
//         }

//         // create new Booking entry

//         const newEntry = new Booking({
//             timeslotIds,
//             userId,
//             bookingPax,
//             bookingDate: new Date()
//         })

//         await newEntry.save()

//         return new Response(JSON.stringify("Booking successful"), { status: 201 })
//     } catch (error) {
//         return new Response("Failed to create a new waitlist entry", { status: 500 })
//     }
// }


// import { connectToDB } from "@utils/database";
// import Booking from "@models/Booking";
// import TimeSlot from "@models/TimeSlot";
// import mongoose from "mongoose";

// export const POST = async (req, res) => {
//     const { timeslotIds, bookingPax, userId } = await req.json();
//     try {
//         await connectToDB();

//         const session = await mongoose.startSession();
//         session.startTransaction();

//         // Check capacity and update timeslots
//         for (const id of timeslotIds) {
//             const timeslot = await TimeSlot.findById(id).session(session);
//             if (!timeslot) throw new Error("Timeslot not found");
//             if (timeslot.currentOccupancy + bookingPax > timeslot.capacity) {
//                 throw new Error("Not enough capacity");
//             }
//             timeslot.currentOccupancy += bookingPax;
//             if (timeslot.currentOccupancy === timeslot.capacity) {
//                 timeslot.status = 'booked';
//             }
//             await timeslot.save({ session });
//         }

//         // Create new Booking entry
//         const newEntry = new Booking({
//             timeslotIds,
//             userId,
//             bookingPax,
//             bookingDate: new Date()
//         });
//         await newEntry.save({ session });

//         await session.commitTransaction();
//         session.endSession();
//         return new Response(JSON.stringify("Booking successful"), { status: 201 })
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         return new Response("Failed to create a new waitlist entry", { status: 500 })
//     }
// };





import mongoose from 'mongoose';
import { connectToDB } from "@utils/database";
import Booking from "@models/Booking";
import TimeSlot from "@models/TimeSlot";

export const POST = async (req, res) => {
    const { timeslotIds, bookingPax, userId } = await req.json();
        await connectToDB();

        var session = await mongoose.startSession();
        session.startTransaction();
    try {

        // Check capacity and update timeslots
        for (const id of timeslotIds) {
            const timeslot = await TimeSlot.findById(id).session(session);
            if (!timeslot) {
                throw new Error("Timeslot not found");
            }

            console.log( timeslot.currentOccupancy + parseInt(bookingPax))
            console.log(parseInt(timeslot.capacity))
            if (timeslot.currentOccupancy + parseInt(bookingPax) > parseInt(timeslot.capacity)) {
                throw new Error("Not enough capacity");
            }
            timeslot.currentOccupancy += parseInt(bookingPax);
            if (timeslot.currentOccupancy === timeslot.capacity) {
                timeslot.status = 'booked';
            }
            await timeslot.save({ session });
        }

        // Create new Booking entry
        const newEntry = new Booking({
            timeslotIds,
            userId,
            bookingPax,
            bookingDate: new Date()
        });
        await newEntry.save({ session });

        await session.commitTransaction();
        session.endSession();
        return new Response(JSON.stringify("Booking successful"), { status: 201 })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error)
        return new Response("Failed to create a new waitlist entry", { status: 500 })
    }
};
