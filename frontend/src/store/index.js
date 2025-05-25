import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice.js";
import chatsSlice from "./slices/chatsSlice.js";
import messagesSlice from "./slices/messagesSlice.js";

const store = configureStore({
	reducer: {
		auth: authSlice,
		chats: chatsSlice,
		messages: messagesSlice
	}
});

export default store;