import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Utilisateur statique simulé
const DEMO_USER = {
  id: 1,
  name: 'Admin Club',
  email: 'admin@club.com',
  role: 'admin',
  team_id: null,
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const isLoading = false

  async function login({ email, password }) {
    // Accepte n'importe quelles credentials pour la démo
    if (!email || !password) {
      throw { response: { data: { message: 'Identifiants incorrects.' } } }
    }
    setUser(DEMO_USER)
    return DEMO_USER
  }

  async function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
