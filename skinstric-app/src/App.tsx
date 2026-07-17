import { Routes, Route } from "react-router-dom";
import Landing from "./pages/homePage/Landing";
import Introduction from "./pages/testing/Introduction";
import UploadImage from "./pages/imageLoading/UploadImage";
import './App.css'


export default function App(){
  return (
    <Routes>
      <Route path='/' element={<Landing/>}/>
      <Route path='/intro' element={<Introduction/>}/>
      <Route path='/upload' element={<UploadImage/>}/>
      
      



    </Routes>
  )
}