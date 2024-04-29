import { connectToDB } from '@utils/database';
import Club from '@models/Club';

export const GET = async (req) => {
    try {
        await connectToDB()
        const clubs = await Club.find({})
        return new Response(JSON.stringify(clubs), {status: 200})
    } catch (error) {
        return new Response("Failed to fetch all clubs", {status: 500})
    }
}