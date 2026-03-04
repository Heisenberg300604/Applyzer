import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface UserContextType {
    userId: string | null
    isLoggedIn: boolean
    setUserId: (id: string) => void
    logout: () => void
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
    const [userId, setUserIdState] = useState<string | null>(
        () => localStorage.getItem('Applyzer_user_id')
    )

    const setUserId = (id: string) => {
        localStorage.setItem('Applyzer_user_id', id)
        setUserIdState(id)
    }

    const logout = () => {
        localStorage.removeItem('Applyzer_user_id')
        setUserIdState(null)
    }

    return (
        <UserContext.Provider value={{ userId, isLoggedIn: !!userId, setUserId, logout }}>
            {children}
        </UserContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
    const ctx = useContext(UserContext)
    if (!ctx) throw new Error('useUser must be used within UserProvider')
    return ctx
}
