import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useRouter } from "next/navigation";

const ClubCard = ({clubId, clubImg, clubName, area, availableTimeslots, selectedDate}) => {

    const router = useRouter()

    const handleClick = () => {
        router.push(`/club?id=${clubId}`)
    }

    let dateString = selectedDate

    if (!selectedDate) {
        const today = new Date()
        const timeZone = 'America/Toronto'
        dateString = today.toLocaleString('en-CA', {
            timeZone: timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).split('/').reverse().join('-')
    }

    console.log(dateString)

    const todaySlots = availableTimeslots.filter(slot => slot.date === dateString)

    // let availableSlots = availableTimeslots
    // if (selectedDate) {
    //     availableSlots = availableTimeslots.filter(slot => slot.date === selectedDate) 
    // }

    // console.log("today slots: ", todaySlots)

    const numberOfSlots = todaySlots.length
  return (
    <div className='rounded-lg shadow-lg m-3 bg-white w-72 cursor-pointer' onClick={handleClick}>
        <div className='relative'>
            <Image
                src={clubImg}
                width={300}
                height={300}
                alt="court picture"
                className='rounded-t-lg w-full h-48'
            />
        </div>
        <div className='py-2 px-3 w-full'>
            <div className='text-xl font-semibold'>
                {clubName}
            </div>
            <div className='mb-2'>
                Location ({area})
            </div>
            <div className='w-full flex justify-around flex-wrap mb-1'>
                {numberOfSlots > 0 && todaySlots.slice(0, 6).map((timeSlot, index) => (
                    <span key={index} className='bg-green-400 rounded-lg px-2 py-1 text-sm mb-1 w-20 text-center'>
                        {timeSlot.startTime} 
                    </span>
                ))}
            </div>
            <div className='text-xs'>{numberOfSlots > 6 && "More slots available..."}</div>
            <div className='text-xs'>{!selectedDate && "Click to view available timeslots"}</div>
        </div>
    </div>
  )
}

export default ClubCard