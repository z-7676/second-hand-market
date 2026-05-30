import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jvxdtsltxlcdiisxdbgj.supabase.co'
const supabaseAnonKey = 'sb_publishable_QCtKFtDv6NY4TH8vAl9b6A_wfkmb4MU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
