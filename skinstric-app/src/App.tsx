import { Routes, Route } from "react-router-dom";
import Landing from "./pages/homePage/Landing";
import Introduction from "./pages/testing/Introduction";
import './App.css'


export default function App(){
  return (
    <Routes>
      <Route path='/' element={<Landing/>}/>
      <Route path='/introduction' element={<Introduction/>}/>

    </Routes>
  )
}