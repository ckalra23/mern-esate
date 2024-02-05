import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage'
import{app} from '../firebase'

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user)
  const fileRef=useRef();
  const[files,setFile]=useState(undefined);
  const[filePerc,setFilePerc]=useState(0);
  const[fileUploadError,setfileUploadError]=useState(false)
  const[formData,setFormData]=useState({})
  useEffect(()=>{
    if(files){
      handleFileUpload(files);
    }

  },[files])
  const handleFileUpload=(files)=>{
    const storage=getStorage(app)
    const fileName=new Date().getTime()+files.name;
    const storageRef=ref(storage,fileName)
    const uploadTask=uploadBytesResumable(storageRef,files);
    uploadTask.on('state-changed',(snapshot)=>{
      const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
      setFilePerc(Math.round(progress))
    },
    (error)=>{
      setfileUploadError(true);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref)
      .then((downloadURL)=>{
        setFormData({...formData,avatar:downloadURL})
      })
    },
    )
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Profile
      </h1>
      <form className='flex flex-col gap-4'>
        {/*we are using ref tag to store the reference of input element in fileRef*/}
        <input onChange={(e)=>setFile(e.target.files[0])}
        type="file" ref={fileRef} hidden accept='image/*' />
        {/* on clicking the image input is being clicked because fileref.current contains the input that we have stored in fileRef */}
        <img onClick={()=>fileRef.current.click()}
        src={formData.avatar||currentUser.avatar} alt="profile"
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <p className='text-sm self-center'>
          {fileUploadError?(
            <span className='text-red-700'>Error Image upload (image must be less than 2mb)</span>
          ): filePerc>0&&filePerc<100?(
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ):filePerc===100?(
            <span className='text-green-700'>Image successfully uploaded</span>
          ):(
            ""
          )}
        </p>
        <input type="text" placeholder='username'
          id='username' className='border p-3 rounded-lg' />
        <input type="email" placeholder='email'
          id='email' className='border p-3 rounded-lg' />
        <input type="text" placeholder='password'
          id='password' className='border p-3 rounded-lg' />
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity:95 disabled:opacity-80'>
          update
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  )
}
