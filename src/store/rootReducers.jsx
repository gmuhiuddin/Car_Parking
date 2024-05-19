import { combineReducers } from "redux";
import userSlice from './userSlice.jsx';

const rootReducers = combineReducers({
    userInfo: userSlice.reducer
});

export default rootReducers;