import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from "react-redux";
import store from "./store/index.js";
import {initializeSignalR} from "./services/signalR.js";

initializeSignalR(store).catch(console.error);

createRoot(document.getElementById('root')).render(<StrictMode>
	<Provider store={store}>
		<App/>
	</Provider>
</StrictMode>);
