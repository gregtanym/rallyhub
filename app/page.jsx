"use client"

import React, { useEffect, useState } from 'react'
import { IoLocationOutline } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import ClubCard from '@components/ClubCard';
import { useGlobalContext } from './Context/store';

const Home = () => {

  const {getAllClubsAndTimeSlots, clubInfo} = useGlobalContext()
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [filteredClubs, setFilteredClubs] = useState([]);

  useEffect(() => {
    getAllClubsAndTimeSlots()
  }, [])

  useEffect(() => {
    setFilteredClubs(clubInfo); // Initialize filteredClubs with all clubs on component mount
  }, [clubInfo]);

  useEffect(() => {
    console.log(filteredClubs)
  }, [filteredClubs])

  const handleSearch = () => {
    console.log("selected date: ", selectedDate)
    console.log("selected time: ", selectedTime)
    const filtered = clubInfo.filter(club => {
      // Check if any filter criteria are provided
      const filtersAreActive = searchQuery || selectedArea || selectedDate || selectedTime;

      // Apply filters only if they are active
      if (!filtersAreActive) {
          return true; // If no filters are active, include all clubs
      }

      const nameMatches = searchQuery ? club.clubName.toLowerCase().includes(searchQuery.toLowerCase()) : true;
      const areaMatches = selectedArea ? club.area === selectedArea : true;
      const timeslotMatches = club.timeSlots.filter(slot => {
          const slotDate = new Date(slot.date);
          const inputDate = new Date(selectedDate);
          
          const slotTime = slot.startTime; // Assuming 'HH:MM' format
          const inputTime = selectedTime; // 'HH:MM' format from input

          const dateMatches = selectedDate ? slotDate.toISOString().split('T')[0] === inputDate.toISOString().split('T')[0] : true;
          const timeMatches = selectedTime ? slotTime >= inputTime : true;

          return dateMatches && timeMatches;
      });

      // Check if timeslot matches have valid entries only if date or time is selected
      return nameMatches && areaMatches && (!selectedDate && !selectedTime || timeslotMatches.length > 0);
    });
    setFilteredClubs(filtered);
  };

  return (
    <div className='w-full flex flex-col px-28 justify-center items-center'>
      {/* Desktop Navigation */}
      <div className='w-full flex flex-col justify-center items-center text-white'>
        <div className='sm:flex hidden text-6xl font-semibold mb-10'>
          Find a court to play Tennis & Pickleball near you!
        </div>

        <div className="flex items-center justify-between bg-white py-4 px-6 rounded-lg shadow mt-3 w-4/5 h-20 text-black mb-10">
          <div className="flex flex-row items-center space-x-4 w-3/4 border-b border-black mr-8 py-2 min-h-full">
              <IoSearchOutline className="mr-1"/> 
              <input type="text" placeholder="Search club" className="w-full outline-none"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex flex-row items-center border-b border-black mr-8 py-2 min-h-full">
              <IoLocationOutline className="mr-1"/>
              <select name="area" id="area" className="outline-none" value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}>
                <option value="">All Areas</option>
                <option value="Toronto">Toronto</option>
                <option value="Markham">Markham</option>
                <option value="Ottawa">Ottawa</option>
                <option value="London">London</option>
                <option value="Waterloo">Waterloo</option>
              </select>
          </div>
          <div className="border-b border-black mr-8 py-2 min-h-full flex flex-row ">
            <input type="date" placeholder="date" className=" outline-none" value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)} />
          </div>
          <div className="border-b border-black mr-8 py-2 min-h-full flex flex-row ">
            <input type="time" placeholder="time" className="w-full outline-none" step={3600} value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)} />
          </div>
          <button className='rounded-full bg-yellow-300 py-2 px-10 hover:bg-yellow-400 font-semibold' onClick={handleSearch}>Search</button>
        </div>
      </div>

      <div className='bg-opacity relative rounded-lg flex flex-row flex-wrap w-11/12 justify-evenly items-start p-10'>
        {filteredClubs.length === 0 && <div>No courts found</div>}
        {filteredClubs.map( (club, index) => 
          <ClubCard
            key={index}
            clubId={club._id}
            clubImg={club.img}
            clubName={club.clubName}
            area={club.area}
            selectedDate={selectedDate}
            availableTimeslots={club.timeSlots}
          />
        )}
      </div>

      {/* Mobile Navigation */}
      <div className='w-full flex justify-center items-center'>
        <div className='sm:hidden flex text-4xl font-semibold w-full justify-end text-end'>
          Find a court to play Tennis & Pickleball near you!
        </div>
      </div>
    </div>
  )
}

export default Home