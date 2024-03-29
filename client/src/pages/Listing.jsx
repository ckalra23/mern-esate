import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom'
import 'swiper/css/bundle';
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
} from 'react-icons/fa';
import { MdDelete, MdEdit } from "react-icons/md";
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';
import { list } from 'firebase/storage';

export default function Listing() {
    SwiperCore.use([Navigation, Autoplay])
    const params = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`)
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                const apiKey = import.meta.env.VITE_MAP_API_KEY;
                const geocodeRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(data.address)}&key=${apiKey}`);
                const geocodeData = await geocodeRes.json();
                const location = geocodeData.results[0].geometry.location;
                data.location = location;
                setListing(data);
                setLoading(false);
                setError(false)
            }
            catch (error) {
                setError(true);
                setLoading(false);
            }
        }
        fetchListing();
    }, [])

    const openGoogleMaps = () => {
        const latitude = listing.location.lat;
        const longitude = listing.location.lng;
        const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        window.open(googleMapsUrl, '_blank');
    };

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
            navigate('/profile')
        } catch (error) {
            console.log(error.message);
        }
    };
    const handleUpdateListing = () => {
        navigate(`/update-listing/${listing._id}`)
    }
    return (
        <main>
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
            {error && <p className='text-center my-7 text-2xl'>Something went wrong</p>}
            {listing && !loading && !error && (
                <div>
                    <Swiper navigation autoplay={{ delay: 2000 }} loop={true}>
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div className='h-[500px]' style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setCopied(true);
                            setTimeout(() => {
                                setCopied(false);
                            }, 2000);
                        }}>
                        <FaShare className='text-slate-500' />
                    </div>
                    {copied && (
                        <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                            Link copied!
                        </p>
                    )}
                    <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                        <div className='flex justify-between'>
                            <p className='text-2xl font-semibold'>
                                {listing.name} - &#8377;{' '}
                                {listing.finalPrice.toLocaleString('en-IN')}
                                {listing.type === 'rent' && ' / month'}
                            </p>
                            {currentUser && listing.userRef === currentUser._id && (
                                <p className='flex gap-6 items-center'>
                                    <button
                                        onClick={() => handleListingDelete(listing._id)}
                                        className='text-red-700 hover:scale-125'
                                        title='Delete'
                                    >
                                        <MdDelete className='h-6 w-6' />
                                    </button>

                                    <button className='text-green-700 hover:scale-125' onClick={handleUpdateListing} title='Edit'>
                                        <MdEdit className='h-6 w-6' />
                                    </button>
                                </p>
                            )}
                        </div>
                        <Link to="#" className='flex items-center gap-2 text-slate-600 text-sm' onClick={openGoogleMaps}>
                            <FaMapMarkerAlt className='text-green-700' />
                            {listing.address}
                        </Link>
                        <div className='flex gap-4'>
                            <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                            </p>
                            {listing.offer && listing.discountPrice!==0 && (
                                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                    Rs.{(+listing.regularPrice - +listing.discountPrice).toLocaleString('en-IN')} OFF
                                </p>
                            )}
                        </div>
                        <p className='text-slate-800'>
                            <span className='font-semibold text-black'>Description - </span>
                            {listing.description}
                        </p>
                        <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaBed className='text-lg' />
                                {listing.bedrooms > 1
                                    ? `${listing.bedrooms} beds `
                                    : `${listing.bedrooms} bed `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaBath className='text-lg' />
                                {listing.bathrooms > 1
                                    ? `${listing.bathrooms} baths `
                                    : `${listing.bathrooms} bath `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaParking className='text-lg' />
                                {listing.parking ? 'Parking spot' : 'No Parking'}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaChair className='text-lg' />
                                {listing.furnished ? 'Furnished' : 'Unfurnished'}
                            </li>
                        </ul>
                        {currentUser && listing.userRef !== currentUser._id && !contact && (
                            <button onClick={() => setContact(true)} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>
                                Contact Landlord
                            </button>
                        )}

                        {contact && <Contact listing={listing} />}
                    </div>
                </div>
            )}

        </main>
    )
}
