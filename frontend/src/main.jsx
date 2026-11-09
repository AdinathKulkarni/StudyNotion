import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import App from './App.jsx'
import { AppProvider } from './contexts/AppProvider.jsx'
import authReducer from './slices/authSlice.js'
import cartReducer from './slices/cartSlice.js'
import courseReducer from './slices/courseSlice.js'
import profileReducer from './slices/profileSlice.js'
import viewCourseReducer from './slices/viewCourseSlice.js'
import './index.css'

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    course: courseReducer,
    profile: profileReducer,
    viewCourse: viewCourseReducer,
  },
})

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AppProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProvider>
  </Provider>
)
