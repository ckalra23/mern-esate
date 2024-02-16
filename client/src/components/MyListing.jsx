import React from 'react'
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import {
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { MdDelete, MdEdit } from "react-icons/md";
export default function MyListing() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const handleShowListings = async () => {
      try {
        setShowListingsError(false);
        setLoading(true);
        const res = await fetch(`/api/user/listings/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          setShowListingsError(true);
          setLoading(false);
          return;
        }
        setLoading(false);
        setUserListings(data);
      } catch (error) {
        setLoading(false);
        setShowListingsError(true);
      }
    };
    handleShowListings();
  }, [])

  const handleListingDelete = async (listingId) => {
    const confirmed = window.confirm('Are you sure to delete this listing?')
    if (!confirmed) {
      return;
    }
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
      if (userListings.length === 1) {
        navigate('/profile');
      }

    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='p-3 sm:p-10'>
      {loading &&
        <div className='flex items-center justify-center h-screen'>
          <button type="button" className="bg-slate-800 text-white font-semibold px-4 py-2 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25"></circle>
              <path d="M 12 2 L 12 6" strokeLinecap="round" strokeWidth="4" className="text-white"></path>
            </svg>
            Loading...
          </button>
        </div>
      }
      {showListingsError && (<p className='text-red-700 text-center my-10'>Something went wrong</p>)}
      {userListings && userListings.length > 0 && (
        <div className='w-4/5 mx-auto'>
          <h1 className='text-2xl font-semibold my-10 text-slate-700'>
            Your Listings
          </h1>
          <div className='flex flex-col gap-4 '>
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className='border rounded-lg p-3 flex justify-between items-center gap-4 hover:shadow-md transition-shadow duration-300
              h-[200px] w-full'
              >
                <Link to={`/listing/${listing._id}`} className='flex flex-wrap gap-2 sm:gap-6'>
                  <img
                    src={listing.imageUrls[0]}
                    alt='listing cover'
                    className='object-contain w-[120px] sm:w-[200px]'
                  />
                  <div className='flex flex-col justify-center items-start gap-1 sm:gap-2'>
                    <p className='font-semibold text-xs sm:text-lg'>{listing.name}</p>
                    <p className='flex items-center gap-1 text-xs sm:text-lg'>
                      <FaMapMarkerAlt className='text-green-700' />
                      {listing.address}
                    </p>
                    <p className='text-xs sm:text-lg'>Rs.{listing.finalPrice.toLocaleString('en-IN')}</p>
                  </div>
                </Link>


                <div className='flex flex-col item-center gap-6'>
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className='text-red-700 hover:scale-125'
                    title='Delete'
                  >
                    <MdDelete className='sm:h-6 w-6' />
                  </button>
                  <Link to={`/update-listing/${listing._id}`} >
                    <button className='text-green-700 hover:scale-125' title='Edit'>
                      <MdEdit className='sm:h-6 w-6' />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
