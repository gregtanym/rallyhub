"use client"
import { useEffect, useState } from "react";
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'
import { useGlobalContext } from "@app/Context/store";


const WaitlistModal = ({ isOpen, onClose }) => {
    const { data: session } = useSession()
    const [email, setEmail] = useState('');
    const [area, setArea] = useState('Toronto');

    useEffect(() => {
        if (session?.user?.email) {
            setEmail(session.user.email);
        }
    }, [session])

    const { joinWaitlist } = useGlobalContext()

    const handleSubmit = (e) => {
        console.log(email, area)
        e.preventDefault();
        joinWaitlist(email, area)
        onClose(); // Close the modal on submit
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-1/2">
                <div className="text-2xl font-semibold mb-2">
                    Join our waitlist and get weekly reminders on available courts in your area!
                </div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email" className="block text-md font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        required
                        value={session?.user.email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <label htmlFor="area" className="block text-md font-medium text-gray-700 mt-1">Area</label>
                    <select name="area" id="area" className="outline-none w-full" value={area}
                        onChange={(e) => setArea(e.target.value)}>
                        <option value="Toronto">Toronto</option>
                        <option value="Markham">Markham</option>
                        <option value="Ottawa">Ottawa</option>
                        <option value="London">London</option>
                        <option value="Waterloo">Waterloo</option>
                    </select>
                    <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Join Waitlist
                    </button>
                    <button type="button" onClick={onClose} className="ml-2 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400">
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WaitlistModal