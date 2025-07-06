const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'

export interface ApiResponse<T = any> {
  success: boolean
  message: T | string
  data: T | null
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_URL}${endpoint}`
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  }

  // Get token from localStorage if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token')
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, clear localStorage and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token')
          window.location.href = '/login'
        }
      }
      throw new ApiError(data.message || 'Request failed', response.status, data)
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('Network error', 0, error)
  }
}

// Vendor Auth API calls
export const vendorAuthApi = {
  login: async (email: string, password: string) => {
    return apiRequest<{
      vendor: {
        id: string
        email: string
        businessName: string
        contactPersonName: string
        phoneNumber: string
        businessAddress: string
        businessType: string
        status: string
      }
      tokens: {
        accessToken: string
        refreshToken: string
        expiresIn: string
      }
    }>('/api/v1/vendor-auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  register: async (vendorData: {
    email: string
    password: string
    businessName: string
    businessType: string
    contactName: string
    contactPhone: string
    businessAddress: string
    taxId?: string
    description?: string
    website?: string
  }) => {
    return apiRequest<{
      vendor: any
    }>('/api/v1/vendor-auth/register', {
      method: 'POST',
      body: JSON.stringify(vendorData),
    })
  },

  logout: async () => {
    return apiRequest('/api/v1/vendor-auth/logout', {
      method: 'POST',
    })
  },

  refreshToken: async (refreshToken: string) => {
    return apiRequest<{
      tokens: {
        accessToken: string
        refreshToken: string
        expiresIn: string
      }
    }>('/api/v1/vendor-auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiRequest('/api/v1/vendor-auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  },
}

// Vendor API calls
export const vendorApi = {
  getProfile: async () => {
    return apiRequest<{
      store: any
      statistics: any
    }>('/api/v1/vendor/profile')
  },

  updateProfile: async (data: { name?: string; description?: string; logoUrl?: string }) => {
    return apiRequest('/api/v1/vendor/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  getDashboard: async () => {
    return apiRequest<{
      statistics: {
        products: {
          total: number
          active: number
          inactive: number
          recent: number
        }
        favorites: {
          total: number
        }
      }
      topProducts: Array<{
        id: string
        name: string
        favoriteCount: number
      }>
    }>('/api/v1/vendor/dashboard')
  },

  getProducts: async (params: Record<string, any> = {}) => {
    const searchParams = new URLSearchParams(params)
    return apiRequest<{
      products: any[]
      pagination: any
    }>(`/api/v1/vendor/products?${searchParams}`)
  },

  getProduct: async (id: string) => {
    return apiRequest<{ product: any }>(`/api/v1/vendor/products/${id}`)
  },

  createProduct: async (data: {
    name: string
    weight: number
    popularityScore: number
    colors: string[]
  }) => {
    return apiRequest<{
      product: any
      images: any[]
    }>('/api/v1/vendor/products', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  updateProduct: async (id: string, data: any) => {
    return apiRequest<{ product: any }>(`/api/v1/vendor/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  deleteProduct: async (id: string) => {
    return apiRequest(`/api/v1/vendor/products/${id}`, {
      method: 'DELETE',
    })
  },
}
