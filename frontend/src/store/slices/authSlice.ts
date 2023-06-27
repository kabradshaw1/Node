import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type State = {
  token: string | null,
  user: {
    _id: string | null,
    username: string | null,
  } | null
}

const initialState: State = { token: null, user: null};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(
      state: State,
      action: PayloadAction<State>
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user
    },
    logout(state: State) {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice;