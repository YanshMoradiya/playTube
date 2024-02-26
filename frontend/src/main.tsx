import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
import './index.css'
import store from "./store/store"
import { Provider } from "react-redux"
import {  RouterProvider, createBrowserRouter } from 'react-router-dom'
import pagesData from './components/Page/routes/pageData'

const router= createBrowserRouter(pagesData);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store} >
    <React.StrictMode>
      <RouterProvider router={router}/>
    </React.StrictMode>
  </Provider>,
)
