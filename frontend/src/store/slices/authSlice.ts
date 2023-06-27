import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type State = {
  token: string | null,
  _id: string | null | undefined,
  username: string | null | undefined,
}

const initialState: State = { token: null, _id: null, username: null, };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(
      state: State,
      action: PayloadAction<State>
    ) {
      state.token = action.payload.token;
      state._id = action.payload._id;
      state.username = action.payload.username;
    },
    logout(state: State) {
      state._id = null;
      state.token = null;
      state.username = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice;