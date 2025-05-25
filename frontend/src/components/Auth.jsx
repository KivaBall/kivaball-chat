import {useState} from "react";
import {createPortal} from "react-dom";
import {useDispatch} from "react-redux";
import {setToken} from "../store/slices/authSlice.js";

export default function Auth() {
	const dispatch = useDispatch();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	async function handleLogin() {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({username, password}),
			});

			const text = await res.text();

			if (!res.ok) {
				setError(text);
			} else {
				dispatch(setToken(text));
			}
		} catch (e) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	}

	async function handleRegister() {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({username, password}),
			});

			if (!res.ok) {
				const text = await res.text();
				setError(text);
			} else {
				alert("Registration is successful! Please log in");
			}
		} catch (e) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	}

	return createPortal(<div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
		<div className="bg-gray-800 text-gray-100 p-6 w-full max-w-md rounded-md shadow-lg">
			<h2 className="text-2xl mb-4 font-semibold text-center">Login / Register</h2>
			{error && <p className="text-red-500 mb-4">{error}</p>}
			<input
				type="text"
				placeholder="Username"
				value={username}
				onChange={e => setUsername(e.target.value)}
				className="w-full mb-3 px-3 py-2 bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={e => setPassword(e.target.value)}
				className="w-full mb-4 px-3 py-2 bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<div className="flex space-x-4">
				<button
					onClick={handleRegister}
					disabled={loading}
					className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 text-white font-semibold disabled:opacity-50"
				>
					Register
				</button>
				<button
					onClick={handleLogin}
					disabled={loading}
					className="flex-1 bg-green-600 hover:bg-green-700 py-2 text-white font-semibold disabled:opacity-50"
				>
					Login
				</button>
			</div>
		</div>
	</div>, document.getElementById("foreground"));
}