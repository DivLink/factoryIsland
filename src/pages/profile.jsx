// Profile.jsx
import React, { useEffect, useState } from "react";
import Nav from "./nav";
import { HeartIcon } from "@heroicons/react/24/solid"
import { UserCircleIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

function Profile({ currentUser }) {

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  const user = {
    name: currentUser.displayName || "Unnamed User",
    email: currentUser.email || "Not Provided",
    address: "1234 Sample Street, Cebu City", // Replace with dynamic if needed
    joined: new Date(currentUser.metadata?.creationTime).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    }),
    profilePic: currentUser.photoURL || null,
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans">
      <Nav />

      <div className="max-w-4xl mx-auto mt-10 px-4">
        {/* Profile Header */}
        <div className="bg-[#1f1f1f] p-6 rounded-lg shadow-lg">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
              {user.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserCircleIcon className="text-gray-500 w-20 h-20" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-gray-400 text-sm">Joined: {user.joined}</p>
              <p className="text-gray-400 text-sm">{user.email}</p>
              <p className="text-gray-400 text-sm">{user.address}</p>
            </div>
            <button className="flex items-center px-3 py-1.5 bg-[#00B8A9] hover:bg-[#009688] text-sm rounded-md font-medium transition">
              <PencilSquareIcon className="w-4 h-4 mr-1" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Account Settings */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-[#00B8A9] mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div className="bg-[#1f1f1f] p-4 rounded-lg">
              <p className="text-gray-300">
                Email Notifications: <span className="text-[#00B8A9]">Enabled</span>
              </p>
            </div>
            <div className="bg-[#1f1f1f] p-4 rounded-lg">
              <p className="text-gray-300">
                Preferred Location: <span className="text-[#00B8A9]">Cebu City</span>
              </p>
            </div>
          </div>
        </div>

  
<div className="mt-6">
  <h4 className="text-blue-400 font-semibold mb-3">📦 Orders</h4>
  <div className="space-y-4">
    
    {/* Confirmed Order */}
    <div className="bg-[#1f1f1f] p-4 rounded-lg border-l-4 border-green-400 shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-white font-semibold">Racing Leather Jacket</h4>
          <p className="text-gray-400 text-sm">Order ID: ORD2001</p>
          <p className="text-gray-400 text-sm">Date: 2025-06-10</p>
          <span className="inline-block px-2 py-0.5 bg-green-500 text-black text-xs rounded-full mt-1">
            Ready to Deliver
          </span>
        </div>
        <div className="text-green-400 font-bold">₱5,500</div>
      </div>
    </div>

    {/* Pending Order */}
    <div className="bg-[#1f1f1f] p-4 rounded-lg border-l-4 border-yellow-400 shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-white font-semibold">Full Face Visor</h4>
          <p className="text-gray-400 text-sm">Order ID: ORD2002</p>
          <p className="text-gray-400 text-sm">Date: 2025-06-15</p>
          <span className="inline-block px-2 py-0.5 bg-yellow-500 text-black text-xs rounded-full mt-1">
            Pending
          </span>
        </div>
        <div className="text-yellow-400 font-bold">₱1,300</div>
      </div>
    </div>

    {/* Shipped Order with Hearts */}
    <div className="bg-[#1f1f1f] p-4 rounded-lg border-l-4 border-blue-400 shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-white font-semibold">Motorcycle Saddle Bag</h4>
          <p className="text-gray-400 text-sm">Order ID: ORD2003</p>
          <p className="text-gray-400 text-sm">Date: 2025-06-18</p>
          <span className="inline-block px-2 py-0.5 bg-blue-500 text-black text-xs rounded-full mt-1">
            Shipped
          </span>
        </div>
        <div className="text-blue-400 font-bold">₱3,800</div>
      </div>

      {/* Hearts for shipped item */}
      <div className="flex items-center gap-1 mt-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <HeartIcon
            key={i}
            className={`h-4 w-4 cursor-pointer ${
              i <= 3 ? "text-[#ff6b81]" : "text-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
  </div>
</div>
      </div>
    </div>
  );
}

export default Profile;
