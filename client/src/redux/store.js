import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
const reduxDevToolsExtension =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
export const store = configureStore({
  reducer: {user:userReducer},
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
    serializableCheck:false
  }),
  devTools: reduxDevToolsExtension,
})
