import {
  ShoppingCartIcon,
  BellIcon,
  GlobeAltIcon,
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

import { useEffect, useState } from "react";
import factoryIslandLogo from "../assets/factoryislandtrans2.png";
import {
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Nav({ openLoginPopup, openSignupPopup }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate(); // ✅ Only declared once

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // If no displayName is set, assign a random one
        if (!user.displayName) {
          const randomName = generateRandomUsername();
          try {
            await updateProfile(user, { displayName: randomName });
            console.log("Assigned random username:", randomName);
            setCurrentUser({ ...user, displayName: randomName });
          } catch (error) {
            console.error("Error setting displayName:", error);
          }
        } else {
          setCurrentUser(user);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const generateRandomUsername = () => {
    const adjectives = ["Blue", "Bright", "Fast", "Loyal", "Cool", "Smart"];
    const animals = ["Fox", "Tiger", "Panda", "Eagle", "Shark", "Wolf"];
    const number = Math.floor(1000 + Math.random() * 9000);
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    return `User${number}${adj}${animal}`;
  };

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowDropdown(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-[#1f1f3d] px-6 py-4 shadow-md">
      {/* === Top Navigation Row === */}
      <div className="hidden md:flex items-center justify-end w-full gap-4 mb-4 text-white text-sm">
        <button className="hover:text-[#00B8A9] flex items-center font-light">
          <GlobeAltIcon className="h-5 w-5" title="Language" />
          <span className="ml-1">Language</span>
        </button>
        <button className="hover:text-[#00B8A9] flex items-center font-light">
          <QuestionMarkCircleIcon className="h-5 w-5" title="Help" />
          <span className="ml-1">Help</span>
        </button>
        <button className="hover:text-[#00B8A9] flex items-center font-light">
          <BellIcon className="h-5 w-5" title="Notifications" />
          <span className="ml-1">Notifications</span>
        </button>

        {!currentUser && (
          <>
            <button
              onClick={openLoginPopup}
              className="hover:text-[#00B8A9] font-medium"
            >
              Login
            </button>
            <span>|</span>
            <button
              onClick={openSignupPopup}
              className="hover:text-[#00B8A9] font-medium"
            >
              Signup
            </button>
          </>
        )}
      </div>

      {/* === Bottom Navigation Row === */}
            {/* === Bottom Navigation Row === */}
            <div className="flex items-center justify-between w-full">
        {/* Updated Logo Container */}
        <div
  className="relative h-16 w-auto mr-4 md:mr-0 overflow-visible flex items-center"
  style={{ width: 'auto' }}
>
  <img
    src={factoryIslandLogo}
    alt="Logo"
    className="h-10 md:h-30 w-auto object-contain md:-translate-y-3"
  />
        </div>

        <div className="flex items-center gap-4 flex-grow justify-end">
          {/* Search Bar */}
          <div className="relative w-full max-w-xs">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#2d2d4d] text-white placeholder-gray-400 focus:outline-none"
            />
          </div>

          {/* Cart Button */}
          <div className="relative">
            <button className="p-2 rounded-full bg-white text-[#1f1f3d] hover:bg-gray-200 transition">
              <ShoppingCartIcon className="h-6 w-6" />
            </button>
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              2
            </span>
          </div>

          {/* Profile Icon (only if logged in) */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="p-2 rounded-full bg-white text-[#1f1f3d] hover:bg-gray-200 transition"
              >
                <UserCircleIcon className="h-6 w-6" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 rounded shadow-lg z-50 bg-[#2c2c4a] text-white">
                  <div className="px-4 py-2 text-sm border-b border-gray-600">
                    {currentUser.displayName}
                  </div>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-[#3c3c5c] text-left"
                  >
                    <UserIcon className="h-5 w-5" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-[#3c3c5c] text-left"
                  >
                    <Cog6ToothIcon className="h-5 w-5" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-[#3c3c5c] text-left"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </nav>
  );
}

export default Nav;
