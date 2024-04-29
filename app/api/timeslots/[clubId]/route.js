import { connectToDB } from "@utils/database";
import TimeSlot from "@models/TimeSlot";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types

export const GET = async (req, {params}) => {
    try {
        await connectToDB()
        const timeslots = await TimeSlot.find({club_id: params.clubId})
        return new Response(JSON.stringify(timeslots), {status: 200})
    } catch (error) {
        return new Response("Failed to fetch timeslots", {status: 500})
    }
}
