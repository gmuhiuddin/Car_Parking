import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'userInfo',
    initialState: {
      user: {}
    },
    reducers: {
      setUser: (state, {payload}) => {
        state.user = payload
      },
      removeUser: state => {
        state.user = {}
      }
    }
  })
  
  export const { setUser, removeUser } = userSlice.actions


  export default userSlice;