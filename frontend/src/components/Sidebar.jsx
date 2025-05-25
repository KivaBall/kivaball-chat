import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {setMessages} from "../store/slices/messagesSlice.js";
import {switchChat} from "../store/slices/chatsSlice.js";
import {connection} from "../services/signalR.js";
import {clearToken} from "../store/slices/authSlice.js";

export default function Sidebar() {
	const chats = useSelector(state => state.chats.list);
	const activeChatId = useSelector(state => state.chats.activeChatId);
	const jwtToken = useSelector(state => state.auth.jwtToken);

	const dispatch = useDispatch();

	const [isCreating, setIsCreating] = useState(false);
	const [chatName, setChatName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	function handleCreateClick() {
		setIsCreating(true);
	}

	function handleCancelClick() {
		setIsCreating(false);
		setChatName("");
		setError(null);
	}

	function handleLogoutClick() {
		dispatch(clearToken())
	}

	async function handleConfirmClick() {
		if (!chatName.trim()) {
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chats`, {
				method: "POST", headers: {
					"Content-Type": "application/json", Authorization: `Bearer ${jwtToken}`,
				}, body: JSON.stringify({name: chatName.trim()}),
			});

			if (!res.ok) {
				const text = await res.text();
				setError(text);
			} else {
				setIsCreating(false);
				setChatName("");
			}
		} catch (e) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	}

	async function handleChatClick(chatId) {
		if (chatId === activeChatId) {
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/messages/${chatId}`, {
				headers: {Authorization: `Bearer ${jwtToken}`,},
			});

			if (!res.ok) {
				const text = await res.text();
				setError(text);
				setLoading(false);
				return;
			}

			const messages = await res.json();

			await connection.invoke("SwitchChat", activeChatId ?? 0, chatId);
			dispatch(switchChat(chatId));
			dispatch(setMessages(messages));
		} catch (e) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	}

	return <aside className="w-64 bg-gray-800 border-r border-gray-700 p-4 flex flex-col">
		{!isCreating && (<button
			onClick={handleCreateClick}
			className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
			disabled={loading}
		>
			Create Chat
		</button>)}

		{isCreating && (<div className="mb-4 flex flex-col space-y-2">
			<input
				type="text"
				placeholder="Chat name"
				value={chatName}
				onChange={(e) => setChatName(e.target.value)}
				className="px-3 py-2 bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
				disabled={loading}
			/>
			{error && <p className="text-red-500 text-sm">{error}</p>}
			<div className="flex space-x-2">
				<button
					onClick={handleConfirmClick}
					disabled={loading || !chatName.trim()}
					className="flex-1 bg-green-600 hover:bg-green-700 py-2 text-white font-semibold disabled:opacity-50"
				>
					Confirm
				</button>
				<button
					onClick={handleCancelClick}
					disabled={loading}
					className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 text-white font-semibold disabled:opacity-50"
				>
					Cancel
				</button>
			</div>
		</div>)}

		<hr className="mb-4 border-gray-700"/>

		<button
			onClick={handleLogoutClick}
			className="mb-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold"
		>
			Logout
		</button>

		<hr className="mb-4 border-gray-700"/>

		<nav className="flex-1 overflow-y-auto">
			<ul>
				{chats.map(chat => <li
					key={chat.id}
					className={`py-2 px-2 cursor-pointer ${chat.id === activeChatId ? "bg-gray-700 font-semibold" : "hover:bg-gray-700"}`}
					onClick={() => handleChatClick(chat.id)}
				>
					{chat.name}
				</li>)}
			</ul>
		</nav>
	</aside>;
}