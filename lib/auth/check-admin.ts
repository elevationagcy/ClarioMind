import { createClient } from '@/lib/supabase/client'

export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return false
    
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)  // Changed from 'id' to 'user_id'
      .maybeSingle()
    
    if (error) {
      console.error('Error checking admin status:', error)
      return false
    }
    
    return profile?.role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Admin access required')
  }
  return true
}

