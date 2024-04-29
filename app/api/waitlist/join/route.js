import { connectToDB } from "@utils/database";
import WaitlistEntry from "@models/WaitlistEntry";

export const POST = async (req) => {
    const { email, area } = await req.json();

    try {
        await connectToDB()
        const newEntry = new WaitlistEntry({
            email,
            area
        })

        await newEntry.save()

        return new Response(JSON.stringify(newEntry), { status: 201 })
    } catch (error) {
        return new Response("Failed to create a new waitlist entry", { status: 500 })
    }
}