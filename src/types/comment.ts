export interface Comment {
  id: string
  entryId: string
  content: string
  authorId: string
  authorEmail: string
  authorName?: string
  parentId?: string // Para respuestas anidadas
  replies?: Comment[] // Comentarios hijos
  createdAt: Date
  updatedAt: Date
  isEdited: boolean
  likes: string[] // Array de user IDs que han dado like
  dislikes: string[] // Array de user IDs que han dado dislike
}

export interface CreateCommentData {
  entryId: string
  content: string
  parentId?: string
}

export interface UpdateCommentData {
  content: string
}

export interface ReplyingTo {
  id: string
  authorName: string
  authorEmail: string
}

export interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[]
  replyCount: number
  likeCount: number
  dislikeCount: number
  userLiked: boolean
  userDisliked: boolean
  replyingTo?: ReplyingTo | null
}
