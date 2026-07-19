import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/homePage/LandingPage";
import IntroductionPage from "./pages/testing/IntroductionPage";
import UploadImagePage from "./pages/imageLoading/UploadImagePage";
import SelectOptionsPage from "./pages/selectPage/SelectOptionsPage";
import SelectDataTypePage from "./pages/select/SelectDataTypePage"
import './App.css'


export default function App(){
  return (
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/intro' element={<IntroductionPage/>}/>
      <Route path='/upload' element={<UploadImagePage/>}/>
      <Route path='/select' element={<SelectOptionsPage/>}/>
      <Route path='/results' element={<SelectDataTypePage/>}/>

    </Routes>
  )
}