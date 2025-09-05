export interface Category {
  id: string
  name: string
  description: string
  parentId?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateCategoryData {
  name: string
  description: string
  parentId?: string
}

export interface UpdateCategoryData {
  name?: string
  description?: string
  parentId?: string
}

export interface CategoryWithParent extends Category {
  parent?: Category
}

export interface CategoryTree extends Category {
  children: CategoryTree[]
}

