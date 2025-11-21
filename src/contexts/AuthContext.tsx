  "use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, AuthState, LoginCredentials } from '@/types/user';
import { activityLogger } from '@/lib/activity-logger';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials & { rememberMe?: boolean }) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRole: string[]) => boolean;
  checkUserStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const REMEMBER_ME_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const USER_STATUS_CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutes instead of 10

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  const logout = useCallback(async (reason?: string) => {
    // Çıkış aktivitesi kaydet
    if (authState.user) {
      await activityLogger.log({
        userId: authState.user.id,
        userName: authState.user.name,
        userEmail: authState.user.email,
        action: 'user_logout',
        description: `${authState.user.name} sistemden çıkış yaptı${reason ? ` (${reason})` : ''}`,
        targetType: 'user',
        targetId: authState.user.id,
        status: 'success',
        details: {
          userRole: authState.user.role,
          logoutTime: new Date().toISOString(),
          reason: reason || 'manual'
        }
      });
    }

    // Clear timers
    if (sessionTimer) {
      clearTimeout(sessionTimer);
      setSessionTimer(null);
    }

    localStorage.removeItem('irem_user');
    localStorage.removeItem('irem_session');
    localStorage.removeItem('irem_remember_me');
    localStorage.removeItem('irem_last_user_check');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, [authState.user, sessionTimer]);

  const checkUserStatus = useCallback(async () => {
    if (!authState.user) return;

    try {
      // Only check user status if we haven't checked recently
      const lastCheck = localStorage.getItem('irem_last_user_check');
      const now = Date.now();
      
      if (lastCheck && (now - parseInt(lastCheck)) < USER_STATUS_CHECK_INTERVAL) {
        return; // Skip check if we checked recently
      }

      // Check if user still exists and is active
      const response = await fetch(`/api/users/${authState.user.id}`);
      if (!response.ok) {
        await logout('User not found');
        return;
      }

      const userData = await response.json();
      if (!userData.isActive) {
        await logout('User deactivated');
        return;
      }

      // Store last check timestamp
      localStorage.setItem('irem_last_user_check', now.toString());

      // Only update if there are meaningful changes (exclude timestamps)
      const { lastLogin: userLastLogin, updatedAt: userUpdatedAt, ...userCore } = userData;
      const { lastLogin: stateLastLogin, updatedAt: stateUpdatedAt, ...stateCore } = authState.user;
      
      if (JSON.stringify(userCore) !== JSON.stringify(stateCore)) {
        const userForStorage = { ...userData };
        delete userForStorage.password;
        localStorage.setItem('irem_user', JSON.stringify(userForStorage));
        setAuthState(prev => ({
          ...prev,
          user: userForStorage
        }));
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      // Don't logout on network errors, just log them
    }
  }, [authState.user, logout]);

  const resetSessionTimer = useCallback(() => {
    if (sessionTimer) {
      clearTimeout(sessionTimer);
    }

    const rememberMe = localStorage.getItem('irem_remember_me') === 'true';
    if (rememberMe) return; // No timeout for remember me sessions

    const newTimer = setTimeout(() => {
      logout('Session timeout');
    }, SESSION_TIMEOUT);

    setSessionTimer(newTimer);
    setLastActivity(Date.now());
  }, [sessionTimer, logout]);

  const handleActivity = useCallback((event: Event) => {
    if (authState.isAuthenticated) {
      // Don't interfere with navigation clicks
      const target = event.target as HTMLElement;
      if (target && target.nodeType === Node.ELEMENT_NODE) {
        if (target.tagName === 'A' || 
            (target.closest && target.closest('a')) || 
            (target.closest && target.closest('button'))) {
          return; // Skip activity tracking for navigation elements
        }
      }

      // Throttle activity tracking to improve performance
      const now = Date.now();
      if (now - lastActivity > 120000) { // Increased to 2 minutes to reduce frequency
        resetSessionTimer();
        setLastActivity(now);
      }
    }
  }, [authState.isAuthenticated, resetSessionTimer, lastActivity]);

  useEffect(() => {
    // Use passive listeners and only track non-navigation interactions
    const events = ['keypress', 'scroll']; // Remove click to avoid interfering with navigation
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [handleActivity]);

  useEffect(() => {
    // Check session on page load
    const checkSession = async () => {
      const savedUser = localStorage.getItem('irem_user');
      const sessionData = localStorage.getItem('irem_session');
      const rememberMe = localStorage.getItem('irem_remember_me') === 'true';

      if (savedUser && !authState.isAuthenticated) { // Only set if not already authenticated
        try {
          const user = JSON.parse(savedUser);
          
          // If no session data, create it (for backward compatibility)
          if (!sessionData) {
            localStorage.setItem('irem_session', JSON.stringify({
              timestamp: Date.now(),
              rememberMe: false
            }));
          } else {
            const session = JSON.parse(sessionData);
            const now = Date.now();

            // Check if session is expired
            if (!rememberMe && (now - session.timestamp) > SESSION_TIMEOUT) {
              await logout('Session expired');
              return;
            }

            // Check if remember me is expired
            if (rememberMe && (now - session.timestamp) > REMEMBER_ME_DURATION) {
              await logout('Remember me expired');
              return;
            }
          }

          // Session is valid, set user without API check initially
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Update session timestamp
          localStorage.setItem('irem_session', JSON.stringify({
            timestamp: Date.now(),
            rememberMe
          }));

          // Start session timer if not remember me
          if (!rememberMe) {
            resetSessionTimer();
          }

        } catch (error) {
          console.error('Session check error:', error);
          localStorage.removeItem('irem_user');
          localStorage.removeItem('irem_session');
          localStorage.removeItem('irem_remember_me');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else if (!savedUser) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkSession();
  }, [authState.isAuthenticated, authState.isLoading, logout, resetSessionTimer]);

  // Periodic user status check - further reduced frequency to improve performance
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      // Only set up interval if user is authenticated
      const interval = setInterval(checkUserStatus, USER_STATUS_CHECK_INTERVAL); // Check every 30 minutes
      return () => clearInterval(interval);
    }
  }, [authState.isAuthenticated, authState.user, checkUserStatus]);

  const login = async (credentials: LoginCredentials & { rememberMe?: boolean }): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // API'ye login isteği gönder
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        const updatedUser = {
          ...data.user,
          lastLogin: new Date().toISOString()
        };

        // Şifreyi localStorage'a kaydetme
        const userForStorage = { ...updatedUser };
        delete userForStorage.password;

        localStorage.setItem('irem_user', JSON.stringify(userForStorage));
        
        // Set session data
        localStorage.setItem('irem_session', JSON.stringify({
          timestamp: Date.now(),
          rememberMe: credentials.rememberMe || false
        }));

        // Set remember me flag
        if (credentials.rememberMe) {
          localStorage.setItem('irem_remember_me', 'true');
        } else {
          localStorage.removeItem('irem_remember_me');
        }

        setAuthState({
          user: userForStorage,
          isAuthenticated: true,
          isLoading: false,
        });

        // Start session timer if not remember me
        if (!credentials.rememberMe) {
          resetSessionTimer();
        }

        // Login aktivitesi kaydet
        await activityLogger.log({
          userId: data.user.id,
          userName: data.user.name,
          userEmail: data.user.email,
          action: 'user_login',
          description: `${data.user.name} sisteme giriş yaptı${credentials.rememberMe ? ' (Beni Hatırla)' : ''}`,
          targetType: 'user',
          targetId: data.user.id,
          status: 'success',
          details: {
            userRole: data.user.role,
            loginTime: new Date().toISOString(),
            rememberMe: credentials.rememberMe || false
          }
        });

        return true;
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });

        // Başarısız login aktivitesi kaydet
        await activityLogger.log({
          userId: 'unknown',
          userName: 'Unknown User',
          userEmail: credentials.email,
          action: 'user_login',
          description: `Başarısız giriş denemesi: ${credentials.email}`,
          targetType: 'user',
          status: 'failed',
          details: {
            attemptedEmail: credentials.email,
            failureReason: data.error || 'Giriş başarısız'
          }
        });

        return false;
      }
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      // Hata aktivitesi kaydet
      await activityLogger.log({
        userId: 'unknown',
        userName: 'Unknown User',
        userEmail: credentials.email,
        action: 'user_login',
        description: `Giriş hatası: ${credentials.email}`,
        targetType: 'user',
        status: 'failed',
        details: {
          attemptedEmail: credentials.email,
          error: error instanceof Error ? error.message : 'Bilinmeyen hata'
        }
      });

      return false;
    }
  };

  const hasPermission = (requiredRoles: string[]): boolean => {
    if (!authState.user) return false;
    return requiredRoles.includes(authState.user.role);
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    hasPermission,
    checkUserStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
