"use client"
import React, { useContext, useEffect, useState, useRef, useMemo } from "react"
const AppContext = React.createContext()

const AppProvider = (({children}) => {

    const [clubInfo, setClubInfo] = useState([])

    const getAllClubsAndTimeSlots = async () => {
        try {
            const response = await fetch('/api/clubs');
            const clubs = await response.json();

            console.log(clubs)
    
            const timeSlotPromises = clubs.map(club =>
                fetch(`/api/timeslots/${club._id}`).then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch time slots');
                }
                return response.json();
            }));
    
            const allTimeSlots = await Promise.all(timeSlotPromises);
            const clubsWithTimeSlots = clubs.map((club, index) => ({
                ...club,
                timeSlots: allTimeSlots[index]
            }));
            console.log(clubsWithTimeSlots)
            setClubInfo(clubsWithTimeSlots)
        } catch (error) {
            console.error("Error fetching clubs or time slots: ", error.message);
        }
    };

    const joinWaitlist = async (email, area) => {
        try {
          const response = await fetch("/api/waitlist/join", {
            method: "POST",
            body: JSON.stringify({
              email: email,
              area: area
            }),
          });
          const data = await response.json();
    
          if (response.ok) {
            alert("Successfully joined waitlist")
            router.push("/");
          } 
        //   else {
        //     throw new Error(data.message || 'Something went wrong');
        //   }

        } catch (error) {
          console.log(error.message)
        //   alert(error.message)
        } 
    }

    const createBooking = async (timeslotIds, bookingPax, userId) => {
        try {
          const response = await fetch("/api/new-booking", {
            method: "POST",
            body: JSON.stringify({
                timeslotIds: timeslotIds,
                bookingPax: bookingPax,
                userId: userId
            }),
          });
          const data = await response.json();
    
          if (response.ok) {
            alert("Successfully created new booking")
            router.push("/");
          } 
        } catch (error) {
          console.log(error.message)
        } 
    }

    

    // function convertTime24to12(time24) {
    //     const [hours, minutes] = time24.split(':');
    
    //     // Create a new date object with any date; time is set with the given hours and minutes
    //     const date = new Date(2000, 0, 1, hours, minutes);
        
    //     // Locale-specific formatting, ensuring 12-hour time format with AM/PM
    //     const time12 = date.toLocaleTimeString('en-US', {
    //         hour: '2-digit',
    //         minute: '2-digit',
    //         hour12: true
    //     });
    
    //     return time12;
    // }

    return(
        <AppContext.Provider value={{
            clubInfo,
            getAllClubsAndTimeSlots, joinWaitlist, createBooking
        }}>
            {children}
        </AppContext.Provider>
    )
})

export const useGlobalContext = () => {
    return useContext(AppContext)
}

export { AppContext, AppProvider }