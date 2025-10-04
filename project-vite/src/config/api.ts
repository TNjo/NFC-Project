// API Configuration for Cloud Functions
export const API_ENDPOINTS = {
  // User Management Functions
  ADD_USER: 'https://adduserfn-uupdjznjhq-uc.a.run.app', // No auth required - for creating new users
  ADD_USER_DETAILS: 'https://adduserdetailsfn-uupdjznjhq-uc.a.run.app', // Requires auth - for updating profiles
  GET_USER_DETAILS: 'https://getuserdetailsfn-uupdjznjhq-uc.a.run.app',
  UPDATE_USER: 'https://updateuserfn-uupdjznjhq-uc.a.run.app',
  DELETE_USER: 'https://deleteuserfn-uupdjznjhq-uc.a.run.app',
  GET_ALL_USERS: 'https://getallusersfn-uupdjznjhq-uc.a.run.app',
  
  // URL Management Functions
  GENERATE_USER_URL: 'https://generateuserurlfn-uupdjznjhq-uc.a.run.app',
  GET_USER_BY_URL: 'https://getuserbyurlfn-uupdjznjhq-uc.a.run.app',
  
  // Analytics Functions
  GET_ANALYTICS: 'https://getanalyticsfn-uupdjznjhq-uc.a.run.app',
  TRACK_PAGE_VIEW: 'https://trackpageviewfn-uupdjznjhq-uc.a.run.app',
  
  // Authentication Functions
  CREATE_ADMIN: 'https://createadminfn-uupdjznjhq-uc.a.run.app',
  ADMIN_LOGIN: 'https://adminloginfn-uupdjznjhq-uc.a.run.app',
  VERIFY_ADMIN_TOKEN: 'https://verifyadmintokenfn-uupdjznjhq-uc.a.run.app',
} as const;

// Helper function to build API requests with proper headers
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  return fetch(endpoint, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
};

// Helper function for authenticated API requests
export const authenticatedApiRequest = async (
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<Response> => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  return fetch(endpoint, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
};

// Specific API methods for common operations
export const apiMethods = {
  // Create new user (no auth required)
  createUser: async (userData: any) => {
    return apiRequest(API_ENDPOINTS.ADD_USER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Get user by slug/cardId
  getUserBySlug: async (slug: string) => {
    return apiRequest(`${API_ENDPOINTS.GET_USER_BY_URL}?slug=${slug}`);
  },

  // Get user details by ID
  getUserDetails: async (userId: string) => {
    return apiRequest(`${API_ENDPOINTS.GET_USER_DETAILS}?userId=${userId}`);
  },

  // Update user
  updateUser: async (userId: string, userData: any) => {
    return apiRequest(API_ENDPOINTS.UPDATE_USER, {
      method: 'PUT',
      body: JSON.stringify({ userId, ...userData }),
    });
  },

  // Delete user
  deleteUser: async (userId: string) => {
    return apiRequest(API_ENDPOINTS.DELETE_USER, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });
  },

  // Get all users
  getAllUsers: async () => {
    return apiRequest(API_ENDPOINTS.GET_ALL_USERS);
  },

  // Generate user URL
  generateUserUrl: async (userData: any) => {
    return apiRequest(API_ENDPOINTS.GENERATE_USER_URL, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Get analytics data
  getAnalytics: async () => {
    return apiRequest(API_ENDPOINTS.GET_ANALYTICS);
  },

  // Track page view
  trackPageView: async (userId: string, slug?: string, metadata?: any) => {
    return apiRequest(API_ENDPOINTS.TRACK_PAGE_VIEW, {
      method: 'POST',
      body: JSON.stringify({ userId, slug, metadata }),
    });
  },

  // Authentication Methods
  
  // Create first admin user
  createAdmin: async (adminData: { email: string; password: string; fullName: string }) => {
    return apiRequest(API_ENDPOINTS.CREATE_ADMIN, {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  },

  // Admin email/password login
  adminLogin: async (credentials: { email: string; password: string }) => {
    return apiRequest(API_ENDPOINTS.ADMIN_LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Verify admin token
  verifyAdminToken: async (token: string) => {
    return authenticatedApiRequest(API_ENDPOINTS.VERIFY_ADMIN_TOKEN, token, {
      method: 'GET',
    });
  },

};
