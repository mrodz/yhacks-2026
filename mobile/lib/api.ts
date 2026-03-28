import { Platform } from 'react-native';
import { CreateUserRequest, ConfirmUserRequest, UserResponse, ApiError } from './types';

// On iOS Simulator, localhost works. On Android emulator, use 10.0.2.2.
// On physical device, use your machine's local IP.
const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8080';
    }
    return 'http://localhost:8080';
  }
  // Production URL - update this when deploying
  return 'https://api.clearsign.app';
};

const BASE_URL = getBaseUrl();

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Handle responses with no body (202 Accepted, 204 No Content)
      if (response.status === 202 || response.status === 204) {
        return undefined as T;
      }

      const data = await response.json();

      if (!response.ok) {
        const error = data as ApiError;
        throw new ApiRequestError(
          error.detail || error.title || 'Request failed',
          response.status,
          error
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiRequestError) {
        throw error;
      }
      throw new ApiRequestError(
        'Network error — check that the server is running',
        0
      );
    }
  }

  // === User Registration ===

  /**
   * Step 1: Initiate registration.
   * Validates school email domain, creates Cognito user, sends verification code.
   */
  async initiateRegistration(request: CreateUserRequest): Promise<void> {
    await this.request<void>('/users', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Step 2: Confirm registration with verification code.
   * Confirms Cognito sign-up and creates user in database.
   */
  async confirmRegistration(request: ConfirmUserRequest): Promise<UserResponse> {
    return this.request<UserResponse>('/users/confirm', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // === User CRUD ===

  async getUser(id: number): Promise<UserResponse> {
    return this.request<UserResponse>(`/users/${id}`);
  }

  async getAllUsers(): Promise<UserResponse[]> {
    return this.request<UserResponse[]>('/users');
  }

  async updateUser(id: number, updates: Partial<{ name: string; email: string; personalEmail: string; schoolId: number }>): Promise<UserResponse> {
    return this.request<UserResponse>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteUser(id: number): Promise<void> {
    await this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }
}

export class ApiRequestError extends Error {
  status: number;
  apiError?: ApiError;

  constructor(message: string, status: number, apiError?: ApiError) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.apiError = apiError;
  }

  get userMessage(): string {
    if (this.status === 0) {
      return 'Unable to connect to the server. Please check your connection.';
    }
    if (this.apiError?.detail) {
      return this.apiError.detail;
    }
    if (this.apiError?.title) {
      return this.apiError.title;
    }
    return this.message;
  }
}

// Singleton instance
export const api = new ApiClient();
