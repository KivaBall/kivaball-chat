import {createSlice} from "@reduxjs/toolkit";

const initialState = {
	list: []
};

const messagesSlice = createSlice({
	name: "messages",
	initialState: initialState,
	reducers: {
		setMessages(state, action) {
			state.list = action.payload;
		},
		addMessage(state, action) {
			state.list.push(action.payload);
		}
	}
});

export default messagesSlice.reducer;
export const {setMessages, addMessage} = messagesSlice.actions;