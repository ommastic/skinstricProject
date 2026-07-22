import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/homePage/LandingPage";
import IntroductionPage from "./pages/introduction/IntroductionPage";
import UploadImagePage from "./pages/uploadImage/UploadImagePage";
import SelectOptionsPage from "./pages/selectPage/SelectOptionsPage";
import SelectDataTypePage from "./pages/result/SelectDataTypePage"
import DemographicsPage from "./pages/demographics/DemographicsPage";
import SelfiePage from "./pages/selfie/SelfiePage";
import SummaryPage from "./pages/summary/SummaryPage";
import './App.css'


export default function App(){
  return (
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/intro' element={<IntroductionPage/>}/>
      <Route path='/upload' element={<UploadImagePage/>}/>
      <Route path='/select' element={<SelectOptionsPage/>}/>
      <Route path='/results' element={<SelectDataTypePage/>}/>
      <Route path='/demographics' element={<DemographicsPage />}/>
      <Route path='/summary' element={<SummaryPage />}/>
      <Route path='/camera' element={<SelfiePage />}/>
    </Routes>
  )
}