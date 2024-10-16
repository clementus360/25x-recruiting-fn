import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { OptionsType } from 'cookies-next/lib/types';

// Define constants for the token name and cookie options (such as expiry)
const ACCESS_TOKEN_KEY = 'accessToken';

export function parseJwt(token: string) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }

// Function to set the token in a cookie
export function storeAccessToken(token: string, options = {}) {
    // Set the cookie to last for 30 days (30 * 24 * 60 * 60 = 2592000 seconds)
    const cookieOptions: OptionsType = {
        maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        ...options,
    };

    setCookie(ACCESS_TOKEN_KEY, token, cookieOptions);
}

export function isTokenExpired(token: string): boolean {
  const decodedToken = parseJwt(token);
  if (decodedToken && decodedToken.exp) {
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return decodedToken.exp < currentTime;
  }
  return true; // If token is invalid or doesn't have an expiration, treat it as expired
}

// Function to retrieve the token from the cookie
export function getAccessToken(): string | null {
    const token = getCookie(ACCESS_TOKEN_KEY);
    if (typeof token === 'string') {
      if (isTokenExpired(token)) {
        // If expired, remove the token and return null
        removeAccessToken();
        return null;
    }
        return token;
    }
    return null;
}

// Function to check if the token exists
export function hasAccessToken(): boolean {
    return !!getAccessToken();
}

// Function to delete the access token
export function removeAccessToken() {
    deleteCookie(ACCESS_TOKEN_KEY, { path: '/' });
}
