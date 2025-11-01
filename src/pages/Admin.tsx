import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Login from '../components/Login'
import AdminDashboard from '../components/AdminDashboard'
import './Admin.css'

export default function Admin() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setSession(session)
      })()
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      {!session ? <Login /> : <AdminDashboard />}
    </div>
  )
}
