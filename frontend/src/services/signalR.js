import * as signalR from "@microsoft/signalr";
import {addChat, setChats} from "../store/slices/chatsSlice.js";
import {addMessage} from "../store/slices/messagesSlice.js";

export const connection = new signalR.HubConnectionBuilder()
	.withUrl(`${import.meta.env.VITE_BACKEND_URL}/api/chat`)
	.withAutomaticReconnect()
	.build();

export async function initializeSignalR(store) {
	connection.on("ChatCreated", chat => store.dispatch(addChat(chat)));
	connection.on("MessageCreated", message => store.dispatch(addMessage(message)));

	await connection.start();

	const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chats`);

	if (res.ok) {
		const chats = await res.json();
		store.dispatch(setChats(chats));
	} else {
		console.error("Failed to load chats");
	}

	return connection;
}
