
import{BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'
import Search from './pages/Search'
import MyListing from './components/MyListing'
import TermsAndConditions from './pages/TermsAndConditions'



function App() {

  return (
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<Signin />} />
      <Route path="/sign-up" element={<Signup />} />
      <Route path="/about" element={<About />} />
      <Route path="/search" element={<Search />} />
      <Route path="/listing/:listingId" element={<Listing />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route element={<PrivateRoute />} >
      <Route path="/profile" element={<Profile />} />
      <Route path="/mylisting" element={<MyListing />} />
      <Route path="/create-listing" element={<CreateListing />} />
      <Route path="/update-listing/:listingId" element={<UpdateListing />} />
      </Route>
    </Routes> 
    </BrowserRouter>
  )
}

export default App
