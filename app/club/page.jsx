"use client"

import React, { Suspense, useEffect, useState } from 'react'
import { useGlobalContext } from '@app/Context/store'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

const ClubBookingPage = () => {
    const {clubInfo, getAllClubsAndTimeSlots, createBooking} = useGlobalContext()
    const { data: session } = useSession()
    const searchParams = useSearchParams()
    const clubId = searchParams.get('id')
    const [loading, setLoading] = useState(true);
    const [selectedTimeslots, setSelectedTimeslots] = useState([])
    const [bookingPax, setBookingPax] = useState()

    useEffect(() => {
        if (!clubInfo || clubInfo.length === 0) {
            getAllClubsAndTimeSlots().then(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <div className='text-3xl text-white font-semibold'>Loading...</div>;
    }

    const club = clubInfo.find(club => club._id === clubId);

    if (!club) {
        return <div>Club not found</div>;
    }

    const handleSelectTimeslot = (timeslotId) => {
        setSelectedTimeslots(prev => {
            return prev.includes(timeslotId) ? prev.filter(id => id !== timeslotId) : [...prev, timeslotId];
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();


        createBooking(selectedTimeslots, bookingPax, session.user.id)
    }

    console.log(session)

    return (
        <Suspense fallback={<div className='text-3xl text-white font-semibold'>Loading...</div>}>
            <div className='bg-opacity w-9/12 flex flex-col justify-start items-center p-8 mb-20 rounded-xl'>
                <Image
                    src={club.img}
                    width={300}
                    height={300}
                    alt="court picture"
                    className=' w-1/2 h-96 rounded-xl'
                />
                <div className='w-1/2 mt-3'>
                    <div className='text-4xl font-bold'>
                        {club.clubName}
                    </div>
                    <div className='text-xl font-semibold'>
                        {club.area}
                    </div>
                    <div>
                        {club.description}
                    </div>
                    <div className='w-full'>Select your desired timeslots and click the confirm button below</div>
                    <button className='bg-yellow-300 h-1/2 text-lg font-semibold py-1 px-3 rounded-full my-4' onClick={handleSubmit}>Confirm Your Booking!</button>
                    <div>
                        Selected timeslots:
                        <br/>
                        {selectedTimeslots.map(timeslot => <span>{club.timeSlots.find(ts => ts._id === timeslot).startTime}, </span>)}
                    </div>
                    <div mb-3>
                        Number of pax for your booking: <input type='number' className='border-2 w-1/5 border-gray-500 rounded-md px-2 py-0.5' onChange={e => setBookingPax(e.target.value)}></input>
                    </div>
                    {/* <div className='w-full'>some filtering mechanism</div> */}
                    <div className='mt-3'>
                        {club.timeSlots.map(timeslot => (
                            <div 
                                key={timeslot._id}
                                className={`px-3 py-2 w-1/2 rounded-full cursor-pointer flex items-center justify-center mb-3 ${
                                    timeslot.status === "available" ? 
                                        (selectedTimeslots.includes(timeslot._id) ? 'bg-green-300' : 'bg-green-500') : 
                                        'bg-gray-300 cursor-not-allowed' // Added cursor-not-allowed for extra UI indication
                                }`}
                                onClick={timeslot.status === "available" ? () => handleSelectTimeslot(timeslot._id) : undefined} // Only attach handler if available
                            >
                                {timeslot.date} {timeslot.startTime} ({timeslot.status === "available" ? timeslot.capacity - timeslot.currentOccupancy + ' pax left' : 'fully booked'})
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Suspense>
    )
}

export default ClubBookingPage;