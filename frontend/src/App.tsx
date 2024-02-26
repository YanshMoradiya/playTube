import { Outlet } from "react-router-dom"
import Header from "./components/Header/Header"
import Navbar from "./components/Navbar/Navbar"

function App(): JSX.Element {
  return (
    <>
      <Header />
      <div className="h-[100%] flex w-[100%]">
        <Navbar />
        <main className="ml-[55px] w-[100%]">
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default App
