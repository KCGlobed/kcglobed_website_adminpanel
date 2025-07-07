import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from './slices/userSlice';
import essayReducer from './slices/essaySlice';
import courseReducer from "./slices/courseDataSlice";
import questionReducer from './slices/questionSlice';
import metaReducer from './slices/metaSlice';
import exhibitReducer from './slices/exhibitSlice';
import blogReducer from './slices/blogSlice';
import contactReducer from './slices/contactUsSlice'
import quickContactReducer from './slices/quickContactSlice'
import partnerWithUsReducer from './slices/partnerwithusslice'
import placementSupportReducer from './slices/placementSlice'
import bookOrderReducer from './slices/bookOrderSlice'
import pagesReducer from './slices/pagesSlice'
import bookReducer from './slices/bookSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    essays: essayReducer,
    course: courseReducer,
    question: questionReducer,
    meta: metaReducer,
    exhibit: exhibitReducer,
    blog: blogReducer,
    contact: contactReducer,
    quickContact: quickContactReducer,
    partnerWithUs: partnerWithUsReducer,
    placement: placementSupportReducer,
    book: bookOrderReducer,
    pages: pagesReducer,
    books: bookReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
