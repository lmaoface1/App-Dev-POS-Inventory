import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  // if not log in will be redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  // Role required but user doesn't match → redirect based on their role
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/dashboard' : '/pos'} replace />
  }

  return children
}

export default ProtectedRoute