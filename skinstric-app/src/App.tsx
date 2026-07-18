import { Routes, Route } from "react-router-dom";
import Landing from "./pages/homePage/Landing";
import Introduction from "./pages/testing/IntroductionPage";
import UploadImage from "./pages/imageLoading/UploadImagePage";
import SelectOptions from "./pages/selectPage/SelectOptionsPage";
import './App.css'


export default function App(){
  return (
    <Routes>
      <Route path='/' element={<Landing/>}/>
      <Route path='/intro' element={<Introduction/>}/>
      <Route path='/upload' element={<UploadImage/>}/>
      <Route path='/select' element={<SelectOptions/>}/>
      
      



    </Routes>
  )
}