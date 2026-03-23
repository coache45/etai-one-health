// ─── Couples Mode Types ───

export type PartnershipStatus = 'pending' | 'active' | 'dissolved'

export interface Partnership {
  id: string
  user_id_1: string
  user_id_2: string | null
  invite_email: string
  status: PartnershipStatus
  created_at: string
  updated_at: string
}

export interface PartnerProfile {
  id: string
  email: string
  full_name: string | null
  display_name: string | null
  avatar_url: string | null
}

export interface PartnershipWithPartner extends Partnership {
  partner: PartnerProfile | null
  /** Which side of the partnership the current user is on */
  role: 'inviter' | 'invitee'
}

export interface PresenceState {
  user_id: string
  display_name: string
  online: boolean
  last_seen: string
}

export interface SessionComment {
  id: string
  user_id: string
  display_name: string
  text: string
  created_at: string
}
