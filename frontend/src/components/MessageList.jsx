import {useSelector} from "react-redux";
import {useEffect, useRef} from "react";

export default function MessageList() {
	const messages = useSelector(state => state.messages.list);

	const containerRef = useRef(null);

	const groupedMessages = [];
	let lastUserId = null;
	let currentGroup = null;

	for (const msg of messages) {
		if (msg.userId !== lastUserId) {
			if (currentGroup) {
				groupedMessages.push(currentGroup);
			}
			currentGroup = {
				userId: msg.userId,
				username: msg.username,
				timestamp: msg.timeStamp,
				messages: [{text: msg.text, id: msg.id, sentiment: msg.sentiment}],
			};
			lastUserId = msg.userId;
		} else {
			currentGroup.messages.push({text: msg.text, id: msg.id, sentiment: msg.sentiment});
		}
	}

	if (currentGroup) {
		groupedMessages.push(currentGroup);
	}

	useEffect(() => {
		const el = containerRef.current;
		if (el) {
			el.scrollTop = el.scrollHeight;
		}
	}, [messages]);

	return <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-6">
		{groupedMessages.map((g) => (<div key={`${g.userId}-${g.timestamp}`}>
			<div className="flex items-center space-x-2 mb-1 text-gray-300 font-semibold">
				<span>{g.username}</span>
				<span className="text-sm text-gray-400">{g.timestamp}</span>
			</div>
			<div className="ml-4 space-y-4">
				{g.messages.map((m) => {
					let banner = null;
					let messageClass = "bg-gray-700 px-3 py-2 rounded-none";

					if (m.sentiment === "Negative") {
						banner = (<div className="text-red-400 font-semibold mb-1 text-sm flex items-center space-x-1">
							<span>⚠️ Warning:</span>
							<span>This message might offend you ☠</span>
						</div>);
						messageClass = "bg-red-950 px-3 py-2 rounded-none";
					} else if (m.sentiment === "Positive") {
						banner = (
							<div className="text-green-400 font-semibold mb-1 text-sm flex items-center space-x-1">
								<span>😊 Positive:</span>
								<span>This message is uplifting!</span>
							</div>);
						messageClass = "bg-green-700 px-3 py-2 rounded-none";
					} else if (m.sentiment === "Mixed") {
						banner = (
							<div className="text-yellow-400 font-semibold mb-1 text-sm flex items-center space-x-1">
								<span>⚠️ Mixed sentiment:</span>
								<span>This message might offend or uplift you.</span>
							</div>);
						messageClass = "bg-yellow-950 px-3 py-2 rounded-none";
					}

					return (<div key={m.id}>
						{banner}
						<p className={messageClass}>{m.text}</p>
					</div>);
				})}
			</div>
		</div>))}
	</div>;
}