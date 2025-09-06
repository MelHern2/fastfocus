export interface UserProfile {
  id: string
  email: string
  displayName?: string
  bio?: string
  avatar?: string
  isAdmin: boolean
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserProfileData {
  email: string
  displayName?: string
  bio?: string
  avatar?: string
  isAdmin?: boolean
  emailVerified: boolean
}

export interface UpdateUserProfileData {
  displayName?: string
  bio?: string
  avatar?: string
  emailVerified?: boolean
}






