import { useState } from "react";
import axios from "../Api/axios";


function HomePage():JSX.Element {

  const [page,setPage] = useState(1);

  return (
    <div>HomePage</div>
  )
}

export default HomePage;