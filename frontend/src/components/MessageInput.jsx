import {useRef, useState} from "react";
import {useSelector} from "react-redux";

export default function MessageInput() {
	const [text, setText] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const jwtToken = useSelector(state => state.auth.jwtToken);
	const activeChatId = useSelector(state => state.chats.activeChatId);

	const textareaRef = useRef(null);

	async function handleSend() {
		if (!text.trim() || !activeChatId) {
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/messages`, {
				method: "POST", headers: {
					"Content-Type": "application/json", "Authorization": `Bearer ${jwtToken}`,
				}, body: JSON.stringify({Text: text.trim(), ChatId: activeChatId}),
			});
			if (!res.ok) {
				const text = await res.text();
				setError(text);
			} else {
				setText("");
			}
		} catch (e) {
			setError(e.message);
		} finally {
			setLoading(false);
			setTimeout(() => textareaRef.current?.focus(), 0);
		}
	}

	async function handleKeyDown(e) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			await handleSend();
		}
	}

	return <div className="p-4 border-t border-gray-700">
		<div className="flex space-x-2">
        <textarea
			ref={textareaRef}
			autoFocus
			placeholder="Type a message..."
			className="flex-1 border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 focus:outline-none focus:ring focus:ring-blue-600 resize-none"
			value={text}
			onChange={e => setText(e.target.value)}
			onKeyDown={handleKeyDown}
			disabled={loading}
			rows={2}
		/>
			<button
				onClick={handleSend}
				disabled={loading || !text.trim()}
				className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
			>
				Send
			</button>
		</div>
		{error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
	</div>;
}