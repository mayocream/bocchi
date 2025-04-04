import { AppState } from 'react-native'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pmtetafmtmgklwyeitcx.supabase.co'
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!
export const supabase = createClient(supabaseUrl, supabaseKey)

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})
