import {createSlice} from "@reduxjs/toolkit";

const initialState = {
	list: [], activeChatId: null
};

const chatsSlice = createSlice({
	name: "chats", initialState: initialState, reducers: {
		setChats(state, action) {
			state.list = action.payload;
		}, addChat(state, action) {
			state.list.push(action.payload);
		}, switchChat(state, action) {
			state.activeChatId = action.payload;
		}
	}
});

export default chatsSlice.reducer;
export const {setChats, addChat, switchChat} = chatsSlice.actions;