import Sidebar from "./components/Sidebar.jsx";
import ChatArea from "./components/ChatArea.jsx";
import Auth from "./components/Auth.jsx";
import {useSelector} from "react-redux";

export default function App() {
	const jwtToken = useSelector(state => state.auth.jwtToken);
	const activeChatId = useSelector(state => state.chats.activeChatId);

	return <div className="flex h-screen bg-gray-900 text-gray-100">
		{!jwtToken ? <Auth/> : null}
		<Sidebar/>
		{activeChatId ? <ChatArea/> : null}
	</div>;
}