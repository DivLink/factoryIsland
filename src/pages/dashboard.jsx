import {
  ShoppingCartIcon,
  HeartIcon,
  QuestionMarkCircleIcon,
  GlobeAltIcon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import shopping1Img from "../assets/shopping1.png";
import gaming_set from "../assets/gaming_set.jpg";
import soldOutImg from "../assets/soldout.png";
import Nav from "./nav"
import React, { useState, useRef, useEffect } from "react";

const products = [
  {
    id: 1,
    name: "Shopping1 Premium Wireless Headset",
    price: 850,
    discount: 40,
    location: "Cebu City",
    image: shopping1Img,
    shipping: "Free Shipping",
    preferred: true,
    rating: 4,
    soldOut: false,
  },
  {
    id: 2,
    name: "Prime Gaming Set - Mega Price",
    price: 999,
    discount: 55,
    location: "Davao City",
    image: gaming_set,
    shipping: "Free Shipping",
    preferred: false,
    rating: 3,
    soldOut: true,
  },
];

function Dashboard() {
  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans">

    <Nav />

      {/* Sidebar + Products */}
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="hidden lg:block lg:w-64 h-[calc(100vh-64px)] bg-[#1f1f1f] p-6 shadow-md overflow-y-auto sticky top-[64px]">
          <h2 className="text-lg font-semibold mb-4 text-[#00B8A9]">🔍 Filter Products</h2>
          <div>
            <h3 className="font-medium mb-2 text-[#00B8A9]">By Category</h3>
            <div className="space-y-2">
              {["Headphones", "Gaming Headsets", "Speakers", "Laptops"].map((cat) => (
                <label key={cat} className="flex items-center space-x-2 text-gray-300">
                  <input type="checkbox" className="accent-[#4C4C9D]" />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1 p-8">
          {/* Sort and Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div className="flex gap-2">
              {["Relevant", "Latest", "Top Sale"].map((option) => (
                <button
                  key={option}
                  className="px-4 py-1.5 rounded-full text-sm font-medium bg-[#2c2c2e] text-gray-200 hover:bg-[#444] transition"
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Price:</label>
              <input
                type="number"
                placeholder="Min"
                className="w-20 px-2 py-1 rounded-md bg-[#1e1e1e] text-gray-200 border border-gray-600 focus:outline-none"
              />
              <span className="text-gray-400">–</span>
              <input
                type="number"
                placeholder="Max"
                className="w-20 px-2 py-1 rounded-md bg-[#1e1e1e] text-gray-200 border border-gray-600 focus:outline-none"
              />
              <button className="px-3 py-1 rounded-md bg-[#00B8A9] text-white hover:bg-[#009688] transition text-sm">
                Apply
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className={`relative bg-[#1e1e1e] p-3 rounded-lg shadow hover:shadow-lg transition duration-300 flex flex-col justify-between border ${
                  product.soldOut ? "opacity-60 cursor-not-allowed" : "border-[#2a2a2a]"
                }`}
              >
                {product.soldOut && (
                  <div className="absolute top-2 left-2 z-10">
                    <img src={soldOutImg} alt="Sold Out" className="w-16 h-auto" />
                  </div>
                )}

                <div className="mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="rounded-md w-full h-36 object-cover mb-2"
                  />

                  {product.preferred && (
                    <span className="text-[11px] font-bold text-[#f44336]">★ Preferred</span>
                  )}

                  <h3 className="text-sm font-semibold text-white leading-tight mb-1 line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <HeartIcon
                        key={i}
                        className={`h-4 w-4 mr-0.5 ${
                          i <= product.rating ? "text-[#ff6b81]" : "text-gray-600"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-xs text-gray-400">{product.rating}.0</span>
                  </div>

                  <p className="text-xs text-gray-400 mb-1">{product.shipping}</p>
                  <p className="text-xs text-gray-500">{product.location}</p>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center justify-between text-white">
                    <p className="text-lg font-bold">₱{product.price}</p>
                    <button
                      disabled={product.soldOut}
                      className={`px-3 py-1 rounded-md text-sm font-semibold ${
                        product.soldOut
                          ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                          : "bg-[#00B8A9] text-white hover:bg-[#009688]"
                      }`}
                    >
                      {product.soldOut ? "Sold Out" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
