import { supabase } from './supabase'

// In-memory cache
const profiles = new Map<number, any>()
export const getProfile = async (id: number) => {
  if (profiles.has(id)) {
    return profiles.get(id)
  }

  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('user_id', id)
    .single()

  if (error) {
    return null
  }

  profiles.set(id, data)
  return data
}
