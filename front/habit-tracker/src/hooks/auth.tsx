import {createContext, useState, useCallback, useEffect, type ReactNode, useContext} from "react";

export interface AuthContext {
	isAuthenticated: boolean;
	login: (username: string, password: string) => Promise<boolean>;
	register: (username: string, password: string) => Promise<boolean>;
	logout: () => Promise<void>;
	user: string | null;
}

const AuthContext = createContext<AuthContext | null>(null);

// todo change
const key = "tanstack.auth.user"

function getStoredUser() {
	return localStorage.getItem(key);
}

// todo change from local storage to cookie
function setStoredUser(user: string | null) {
	if (user) {
		localStorage.setItem(key, user)
	} else {
		localStorage.removeItem(key)
	}
}

export function AuthProvider({children}: { children: ReactNode }) {
	const [user, setUser] = useState<string | null>(getStoredUser());
	// cast non bool to bool
	const isAuthenticated = !!user;

	const login = useCallback(
		async (username: string, password: string) => {
			const response = await fetch(import.meta.env.VITE_API_URL + "login",
				{
					credentials: "include",
					mode: "cors",
					method: "POST",
					headers: {
						"Access-Control-Allow-Origin": import.meta.env.VITE_API_URL,
						"Content-Type": "application/json; charset=utf-8",
					},
					body: JSON.stringify({"username": username, "password": password}),
				})

			if (!response.ok) {
				return false;
			}

			setStoredUser(username);
			setUser(username);

			return true;
		},
		[]
	)

	const register = useCallback(
		async (username: string, password: string) => {
				const response = await fetch(import.meta.env.VITE_API_URL + "register",
				{
					credentials: "include",
					mode: "cors",
					method: "POST",
					headers: {
						"Access-Control-Allow-Origin": import.meta.env.VITE_API_URL,
						"Content-Type": "application/json; charset=utf-8",
					},
					body: JSON.stringify({"username": username, "password": password}),
				})

			if (!response.ok) {
				return false
			}

			return await login(username, password);
		},
		[]
	)

	const logout = useCallback(
		async () => {
			setStoredUser(null);
			setUser(null);
		},
		[]
	)



	useEffect(() => {
			setUser(getStoredUser());
		},
		[]
	)

	return (
		<AuthContext.Provider value={{isAuthenticated, user, login, register, logout}}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within the AuthProvider");
	}
	return context;
}