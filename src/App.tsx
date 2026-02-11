
import { Outlet } from 'react-router-dom'
import { HomePage } from './modules'


function App() {

  return (
    <>
      <Outlet/>
      <HomePage/>
    </>
  )
}

export default App
