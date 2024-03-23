import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
import './index.css'
import store from "./store/store"
import { Provider } from "react-redux"
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import pagesData from './Routs/pageData'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const router = createBrowserRouter(pagesData);
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store} >
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>
  </Provider>,
)
