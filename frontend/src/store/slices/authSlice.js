import {createSlice} from "@reduxjs/toolkit";

const initialState = {
	jwtToken: localStorage.getItem("jwtToken") || ""
};

const authSlice = createSlice({
	name: "auth", initialState: initialState, reducers: {
		setToken: (state, action) => {
			state.jwtToken = action.payload;
			localStorage.setItem("jwtToken", action.payload);
		}, clearToken: (state) => {
			state.jwtToken = "";
			localStorage.setItem("jwtToken", "");
		}
	}
});

export default authSlice.reducer;
export const {setToken, clearToken} = authSlice.actions;