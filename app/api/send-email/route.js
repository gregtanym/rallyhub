// get all the emails and the respective areas first
// get the clubs with available timeslots for the week in their area
// email them individually about the available timeslots for the week

import { connectToDB } from "@utils/database";
import TimeSlot from "@models/TimeSlot";
import WaitlistEntry from "@models/WaitlistEntry";
import Club from "@models/Club";
import nodemailer from "nodemailer"

const USERNAME = process.env.NODEMAILER_EMAIL
const PW = process.env.NODEMAILER_PW

export const GET = async (req, res) => {
    console.log(USERNAME)
    console.log(PW)

    try {
        await connectToDB();
        const waitlistEntries = await WaitlistEntry.find({});
        const clubs = await Club.find({});
        const timeSlots = await TimeSlot.find({});

        const clubsWithTimeSlots = clubs.map(club => {
            const slots = timeSlots.filter(ts => ts.club_id === club._id.toString() && ts.status === "available");
            return {...club._doc, timeSlots: slots}; // Include time slots directly in the club object
        });

        for (const entry of waitlistEntries) {
            const clubsInArea = clubsWithTimeSlots.filter(club => club.area === entry.area && club.timeSlots.length > 0);

            const websiteURL = "http://localhost:3000/club?id="
            console.log(clubsInArea)

            if (clubsInArea.length > 0) {
                const clubDetails = clubsInArea.map(club => {
                    return `
                        <h3>${club.clubName}:</h3>
                        <a href="${websiteURL + club._id}">Visit our website to book now</a>
                        <br>
                        ${club.timeSlots.map(slot => `${slot.date} from ${slot.startTime} to ${slot.endTime}`).join('<br>')}
                    `;
                }).join('<br>');


                var transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: USERNAME,
                        pass: PW,
                    },
                });

                var mailOptions = {
                    from: USERNAME,
                    to: entry.email,
                    subject: "Available Timeslots in Your Area This Week!",
                    html: `<h2>The following clubs have these timeslots available:</h2>${clubDetails}`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      throw new Error(error);
                    } else {
                      console.log("Email Sent");
                      return true;
                    }
                });            

            }
        }

        return new Response("email was sent successfully", { status: 200 })
    } catch (error) {
        console.error("Failed to send emails:", error);
        return new Response("Error sending emails", { status: 500 })
    }
}