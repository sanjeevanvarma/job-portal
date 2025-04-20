import React, { useContext } from 'react'
import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Applications from './pages/Applications'
import Applyjob from './pages/Applyjob'
import Home from './pages/Home'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/AppContext'
import Dashboard from './pages/Dashboard'
import AddJob from './pages/AddJob'
import ManageJobs from './pages/ManageJobs'
import ViewApplications from './pages/ViewApplications'
import 'quill/dist/quill.snow.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const {showRecruiterLogin, companyToken} = useContext(AppContext)

  console.log("Backend URL test:", import.meta.env.VITE_BACKEND_URL);

  // useEffect(() => {
  //   fetch(import.meta.env.VITE_BACKEND_URL+'/api/jobs')
  //     .then(res => res.json())
  //     .then(data => console.log(" Test Fetch Response:", data))
  //     .catch(err => console.error("Test Fetch Error:", err));
  // }, []);

  
  return (

    <div>
      { showRecruiterLogin && <RecruiterLogin />}

      <ToastContainer />

      <Routes>
        <Route path = '/' element = {<Home />}/> 
        <Route path = '/apply-job/:id' element = {<Applyjob />}/> 
        <Route path = '/applications' element = {<Applications />}/> 
        <Route path = '/dashboard' element={<Dashboard/>}>
        { companyToken ? <>
          <Route path = 'add-job' element={<AddJob/>}/> 
          <Route path = 'manage-jobs' element={<ManageJobs/>}/> 
          <Route path = 'view-applications' element={<ViewApplications/>}/> 

        </> : null}
          
        </Route>
      </Routes>
    </div>
  )
}

export default App
