export interface Entry {
  id: string
  title: string
  content: string
  excerpt: string
  mainImage?: string
  categoryId: string
  categoryName?: string
  authorId: string
  authorEmail?: string
  published: boolean
  featured: boolean
  tags: string[]
  estimatedReadingTime: string
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
}

export interface CreateEntryData {
  title: string
  content: string
  excerpt: string
  mainImage?: string
  categoryId: string
  published: boolean
  featured: boolean
  tags: string[]
  estimatedReadingTime?: string
}

export interface UpdateEntryData {
  title: string
  content: string
  excerpt: string
  mainImage?: string
  categoryId: string
  published: boolean
  featured: boolean
  tags: string[]
  estimatedReadingTime?: string
}

export interface EntryWithCategory extends Entry {
  category: {
    id: string
    name: string
  }
}
