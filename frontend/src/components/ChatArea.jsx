import MessageInput from "./MessageInput.jsx";
import MessageList from "./MessageList.jsx";

export default function ChatArea() {
	return <main className="flex-1 flex flex-col bg-gray-900">
		<MessageList/>
		<MessageInput/>
	</main>;
}