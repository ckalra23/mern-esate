import React, { useEffect, useState } from 'react'
import {
  updateUserStart, updateUserSuccess,
  updateUserFailure, deleteUserStart, deleteUserFailure,
  deleteUserSuccess, signOutStart, signOutFailure, signOutSuccess
} from '../redux/user/userSlice'

import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import Footer from '../components/Footer'

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const fileRef = useRef();
  const [files, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false)
  const[passwordError,setPasswordError]=useState(false);
  const [formData, setFormData] = useState({
    username: currentUser.username || '',
    email: currentUser.email,
    password: '',
  })
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [isEmptyResponse, setIsEmptyResponse] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log(files);

  useEffect(() => {
    if (files) {
      handleFileUpload(files);
    }

  }, [files])

  const handleFileUpload = (files) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + files.name;
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, files);
    uploadTask.on('state-changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress))
    },
      (error) => {
        setfileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            setFormData({ ...formData, avatar: downloadURL })
          })
      },
    )
  }
  const handleChange = (e) => {
    let value = e.target.value;
    value = value.trim();
    setFormData({ ...formData, [e.target.id]: value })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password.length < 8) {
      // dispatch(updateUserFailure("Password must be at least 8 characters long"));
      setPasswordError(true);
      return;
    }
    try {
      dispatch(updateUserStart());
      const formDataToUpdate = { ...formData };

      // Remove the password field if it's empty
      if (!formDataToUpdate.password) {
        delete formDataToUpdate.password;
      }

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToUpdate),
      })
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        setUpdateSuccess(false);
        return;
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true);
    }
    catch (error) {
      dispatch(updateUserFailure(error.message));
      setUpdateSuccess(false);
    }
  }

  const handleDelete = async () => {
    try {
      const confirmed = window.confirm("Your account will be deleted.Are you sure?");
      if (!confirmed) {
        return; // User cancelled deletion
      }
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      })
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    }
    catch (error) {
      dispatch(deleteUserFailure(error.message))

    }
  }
  const handleSignOut = async () => {
    try {
      const confirmed = window.confirm("Are you sure you want to sign out?");
      if (!confirmed) {
        return;
      }
      dispatch(signOutStart())
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
    }
    catch (error) {
      signOutFailure(error.message);
    }
  }
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      if (data.length === 0) {
        setIsEmptyResponse(true);
        return;
      }
      navigate("/mylisting")
    } catch (error) {
      setShowListingsError(true);
    }
  };

  return (
    <>
      <div className='p-3 max-w-lg mx-auto my-20'>
        <h1 className='text-3xl font-semibold text-center my-7'>
          Profile
        </h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          {/*we are using ref tag to store the reference of input element in fileRef*/}
          <input onChange={(e) => setFile(e.target.files[0])}
            type="file" ref={fileRef} hidden accept='image/*' />
          {/* on clicking the image input is being clicked because fileref.current contains the input that we have stored in fileRef */}
          <img onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar} alt="profile"
            className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
          />
          <p className='text-sm self-center'>
            {fileUploadError ? (
              <span className='text-red-700'>Error Image upload (image must be less than 2mb)</span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className='text-green-700'>Image successfully uploaded</span>
            ) : (
              ""
            )}
          </p>
          <input placeholder='email' id='email' className='border p-3 rounded-lg' disabled value={formData.email} />
          <input type="text" placeholder='username' id='username' className='border p-3 rounded-lg' onChange={handleChange} value={formData.username} />
          <input type="password" placeholder='new password' id='password' className='border p-3 rounded-lg' onChange={handleChange} value={formData.password}/>
          <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? 'loading' : 'update'}
          </button>
          <Link to={"/create-listing"} className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' >
            Create Listing
          </Link>


        </form>
        <div className='flex justify-between mt-5'>
          <span className='text-red-700 cursor-pointer' onClick={handleDelete}>Delete Account</span>
          <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Sign out</span>
        </div>
        {error && <p className='text-red-700 mt-5'>{error}</p>}
        {passwordError&&<p className='text-red-700 mt-5'>Password must be atleast 8 characters long</p>}
        <p className='text-green-700 mt-5'>
          {updateSuccess ? 'User is updated successfully' : ''}
        </p>
        <button className='block w-full mt-5 text-center text-slate-700 hover:text-slate-950 ' onClick={handleShowListings}>
          Show Listings
          {!showListingsError && isEmptyResponse
            && (<p className='text-red-700 mt-5'>No Listing to show</p>)}
          {showListingsError && (<p className='text-red-700 mt-5 '>Something went wrong</p>)}
        </button>
      </div>
      <Footer />
    </>
  )
}
