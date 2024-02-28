import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-200 text-slate-700 py-12 shadow-inner">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h2 className="text-lg font-bold mb-4">Explore</h2>
          <ul>
            <li className="mb-2"><Link to={"/about"} className="hover:text-slate-950">About Us</Link></li>
            <li className="mb-2"><Link to={"/search"} className="hover:text-slate-950">Properties</Link></li>
            <li className="mb-2"><Link to="https://blog.hubspot.com/sales/real-estate-blogs" target="_blank" rel="noopener noreferrer" className="hover:text-slate-950">Blogs</Link></li>
            <li><Link to="https://www.moneycontrol.com/real-estate-property/"  target="_blank" rel="noopener noreferrer" className="hover:text-slate-950">Whats New</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-4">Contact Info</h2>
          <ul>
            <li className="mb-2">Address: Crystal Plaza, Mumbai</li>
            <li className="mb-2">Phone: +91 87654 32109</li>
            <li>Email: urban@nest.com</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-4">Additional Links</h2>
          <ul>
            <li className="mb-2"><Link to={"/terms"} className="hover:text-slate-950">Terms & Conditions</Link></li>
            <li className="mb-2"><p className="hover:text-slate-950">Privacy Policy</p></li>
            <li><p className="hover:text-slate-950">FAQs</p></li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-4">Follow Us</h2>
          <ul className="flex space-x-4">
            <li><Link to="https://www.facebook.com/" target='_blank' rel="noopener noreferrer" className="text-slate-700 hover:text-slate-950"><FaFacebook /></Link></li>
            <li><Link to="https://twitter.com/?lang=en" target='_blank' rel="noopener noreferrer" className="text-slate-700 hover:text-slate-950"><FaTwitter /></Link></li>
            <li><Link to="https://www.instagram.com/accounts/login/" target='_blank' rel="noopener noreferrer" className="text-slate-700 hover:text-slate-950"><FaInstagram /></Link></li>
          </ul>
          <p className='text-slate-700 my-5'>Follow us on our social media platforms for every latest information </p>
        </div>
        <div className="col-span-full text-center mt-8">
          <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} Urban Nest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
