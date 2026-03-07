import { createContext, useContext, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useAuth, useUser as useClerkUser } from '@clerk/react'
import { upsertClerkUser } from '@/lib/supabase'

interface UserContextType {
    userId: string | null
    isLoggedIn: boolean
    setUserId: (id: string) => void
    logout: () => void
}
// radnom
const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
    const { user, isLoaded } = useClerkUser()
    const { signOut } = useAuth()
    const syncedUserIdRef = useRef<string | null>(null)
    const userId = user?.id ?? null

    const setUserId = (id: string) => {
        // Clerk manages user identity; this setter is kept for compatibility.
        if (id !== user?.id) {
            console.warn('setUserId ignored: user id is managed by Clerk.')
        }
    }

    const logout = () => {
        void signOut()
    }

    useEffect(() => {
        if (!isLoaded || !user?.id) return
        if (syncedUserIdRef.current === user.id) return

        const primaryEmail = user.primaryEmailAddress?.emailAddress ?? null
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || null

        void upsertClerkUser({
            id: user.id,
            email: primaryEmail,
            full_name: fullName,
        })
            .then(() => {
                syncedUserIdRef.current = user.id
            })
            .catch((error) => {
                console.error('Failed to sync Clerk user to Supabase:', error)
            })
    }, [isLoaded, user])

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
