import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type State = {
  token: string | null,
  _id: number | null,
}

const initialState: State = { token: null, _id: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthTokens(
      state: State,
      action: PayloadAction<{ token: string }>
    ) {
      state.token = action.payload.token;
    },
    logout(state: State) {
      state._id = null;
      state.token = null;
    },
  },
});

export default authSlice;