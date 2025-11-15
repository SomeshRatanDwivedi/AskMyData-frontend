
import { memo } from 'react';
import MainRouter from './routes'
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

const App=()=> (
  <div className="h-screen bg-(--theme-bg-container) sm:p-4">
    <MainRouter />
    <ToastContainer
      limit={1}
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover
      theme="light"
      style={{ whiteSpace: 'wrap', width: 'fit-content' }}
    />
  </div>
)

export default memo(App)
