# Reactive Authentication System with Auto-Redirect

This document explains how the reactive authentication system works in the React app, bridging the revolt.js client with React's state management and providing automatic redirects after logout.

## Overview

The authentication system consists of five main parts:

1. **`useUser` Hook** - A React hook that provides reactive user state and logout functions
2. **Auth Utilities** - Helper functions for login/logout with comprehensive session destruction
3. **Redirect Utilities** - Smart navigation and route protection
4. **AuthGuard Component** - Route protection and automatic redirects
5. **NavUser Component** - A component that automatically updates when authentication state changes

## How It Works

### The Problem

The revolt.js client uses SolidJS signals internally, but our React components don't automatically re-render when external objects change. When a user successfully logs in, the process involves multiple steps:

1. **API Login Call** - Authenticate with the server
2. **WebSocket Connection** - Establish real-time connection  
3. **Ready Event** - Client receives user data and becomes "ready"

React components using `client.user` directly won't update, and the login process must wait for the complete connection sequence to finish.

### The Solution

The authentication system solves both timing and reactivity issues:

**Connection Timing:**
- Login functions wait for the complete connection sequence
- Progress tracking shows connection steps to users
- Proper error handling for connection timeouts
- 15-second timeout prevents hanging logins

**React Reactivity:**  
The `useUser` hook bridges the revolt.js event system with React's state management by:

1. Listening to revolt.js client events (`ready`, `connecting`, `connected`, `disconnected`, `logout`, `userUpdate`)
2. Managing user state in React state
3. Triggering re-renders when authentication state changes
4. Handling session persistence and restoration

## Usage

### Basic Usage

```tsx
import { useUser } from "@/hooks/use-user";

function MyComponent() {
  const { user, isLoading, isReady, isConnected, logout, forceLogout } = useUser();

  if (isLoading) return <div>Connecting...</div>;
  if (!user) return <div>Please log in</div>;

  return (
    <div>
      <div>Welcome, {user.username}!</div>
      <button onClick={() => logout()}>Logout (→ Login)</button>
      <button onClick={() => logout(false)}>Logout (Stay Here)</button>
      <button onClick={() => forceLogout()}>Force Logout (→ Login)</button>
    </div>
  );
}
```

### Using AuthGuard for Route Protection

```tsx
import { AuthGuard } from "@/components/auth-guard";

function ProtectedPage() {
  return (
    <AuthGuard>
      <div>This content only shows to authenticated users</div>
    </AuthGuard>
  );
}

// Or wrap entire layouts
function Layout({ children }) {
  return (
    <AuthGuard>
      <div className="protected-layout">
        {children}
      </div>
    </AuthGuard>
  );
}
```

### Using Redirect Utilities

```tsx
import { useAuthRedirect, isProtectedRoute } from "@/lib/redirect";

function MyComponent() {
  const { redirectToLogin, redirectToHome } = useAuthRedirect();

  const handleUnauthorized = () => {
    redirectToLogin(); // Smooth client-side navigation
  };

  return <button onClick={handleUnauthorized}>Go to Login</button>;
}
```

### Auth Utilities

```tsx
import { loginWithCredentials, logout, forceLogout, isAuthenticated } from "@/lib/auth";

// Login with complete connection sequence and redirect
// This waits for: API call → WebSocket connection → Ready event
await loginWithCredentials("user@example.com", "password");

// Logout with API call, cleanup, and redirect to login
await logout(); // Default: redirects to /login
await logout(true); // Explicit redirect
await logout(false); // No redirect

// Force logout without API calls (for broken connections)
forceLogout(); // Default: redirects to /login
forceLogout(true); // Explicit redirect
forceLogout(false); // No redirect

// Check authentication status
if (isAuthenticated()) {
  // User is logged in
}
```

## Components

### NavUser Component

The `NavUser` component demonstrates the reactive system in action:

- Shows different states (loading, not logged in, logged in)
- Displays user information when available
- Updates automatically when user logs in/out
- Provides logout functionality with automatic redirect to login
- Handles connection states properly during login process

### AuthGuard Component

The `AuthGuard` component provides route protection:

- Automatically redirects unauthorized users to login
- Shows loading states during authentication checks
- Prevents access to protected routes
- Handles already-authenticated users on login page
- Customizable fallback components

### Debug Page

The debug page (`/app/debug`) shows real-time authentication status with:

- Loading state indicator
- Ready state indicator  
- Connection state indicator
- User authentication status
- User information display
- Multiple logout options:
  - Normal logout with redirect
  - Normal logout without redirect
  - Force logout with redirect
  - Force logout without redirect

## Features

### Session Persistence and Destruction

Sessions are automatically saved to `localStorage` and restored on page reload:

- Sessions are saved after successful login
- Sessions are restored on app initialization
- Sessions are **completely destroyed** on logout with comprehensive cleanup
- Failed session restoration is handled gracefully

#### Complete Session Destruction + Auto-Redirect

The logout process performs comprehensive cleanup and navigation:

- Calls logout API endpoint (if possible)
- Disconnects WebSocket connection
- Clears user data and session tokens
- Removes all session data from localStorage and sessionStorage
- Clears any revolt-related storage keys
- Resets client state completely
- Emits logout events to all components
- **Automatically redirects to login page** (unless disabled)
- Saves current path for potential post-login restoration

### Smart Redirect System

The redirect system provides intelligent navigation:

- **Post-Logout Redirect**: Automatically sends users to login page
- **Post-Login Redirect**: Sends users back to intended destination
- **Route Protection**: Guards protected routes from unauthorized access
- **Path Preservation**: Remembers where users were before logout
- **Flexible Control**: Optional redirects for custom workflows

### Event Handling

The system listens to all relevant revolt.js events:

- `ready` - User has successfully authenticated
- `connecting` - Client is attempting to connect
- `connected` - WebSocket connection established
- `disconnected` - Connection lost
- `logout` - User has logged out
- `userUpdate` - User information has changed
- `error` - Connection or authentication error

### Loading States

Proper loading states are managed for:

- Initial session restoration attempts
- Login process
- Connection establishment
- User data fetching

## Files

### Core Files

- `src/hooks/use-user.ts` - Main reactive hook with logout functions
- `src/lib/auth.ts` - Authentication utilities with session destruction + redirects
- `src/lib/redirect.ts` - Smart navigation and route protection utilities  
- `src/components/auth-guard.tsx` - Route protection component with auto-redirect
- `src/components/nav-user.tsx` - Reactive user component with logout functionality

### Layout Files

- `src/app/app/layout.tsx` - Protected app layout with AuthGuard
- `src/app/login/page.tsx` - Login page with smart post-login redirects

### Demo Files

- `src/app/app/debug/page.tsx` - Authentication status demo with logout options

### Testing the System

1. Navigate to `/app/debug` to see the authentication status
2. Click "Login" to go to the login page
3. Enter credentials and watch the connection progress:
   - "Logging in..." (API call)
   - "Connecting to server..." (WebSocket connecting)
   - "Connected! Authenticating..." (WebSocket connected)
   - "Authentication complete!" (Ready event received)
   - Automatic redirect back to where you came from
4. Watch the debug page update in real-time with detailed connection status
5. The NavUser component in the sidebar will also update
6. Test logout options:
   - **"Logout (→ Login)"**: Normal logout + redirect to login page
   - **"Logout (No Redirect)"**: Normal logout staying on current page
   - **"Force Logout (→ Login)"**: Immediate cleanup + redirect to login
   - **"Force Logout (No Redirect)"**: Immediate cleanup staying on current page
7. Verify complete session destruction and automatic navigation
8. Try accessing protected routes while logged out - should redirect to login
9. After login, should return to the protected route you tried to access

## Benefits

- **Automatic Updates**: Components re-render when authentication state changes
- **Session Persistence**: Users stay logged in across page reloads
- **Complete Session Destruction**: Logout completely clears all session data
- **Smart Navigation**: Automatic redirects with intelligent destination logic
- **Route Protection**: Comprehensive guard system for protected routes
- **Connection Sequencing**: Login waits for complete WebSocket handshake
- **Progress Feedback**: Visual progress during connection establishment
- **Loading States**: Proper UX during authentication flows
- **Timeout Handling**: 15-second timeout prevents hanging connections
- **Type Safety**: Full TypeScript support with proper types
- **Error Handling**: Graceful handling of authentication errors
- **Reusable**: Any component can use the `useUser` hook
- **Flexible Logout Options**: Control over redirect behavior per use case
- **Path Preservation**: Remember and restore user's intended destination
- **Client-Side Navigation**: Smooth transitions using Next.js router

## Migration

To migrate existing components:

**Before:**
```tsx
function MyComponent() {
  return <div>{client.user?.username || "Not logged in"}</div>;
}
```

**After:**
```tsx
function MyComponent() {
  const { user, isLoading, logout, forceLogout } = useUser();
  
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <div>{user?.username || "Not logged in"}</div>
      {user && (
        <>
          <button onClick={() => logout()}>Logout</button>
          <button onClick={() => forceLogout()}>Force Logout</button>
        </>
      )}
    </div>
  );
}
```

This ensures your components automatically update when the user logs in or out, provides logout functionality with complete session destruction, and handles navigation automatically for the best user experience.

## Advanced Usage

### Custom Route Protection

```tsx
// Custom protection with specific redirect
<AuthGuard redirectTo="/custom-login" requireAuth={true}>
  <AdminPanel />
</AuthGuard>

// Higher-order component approach
const ProtectedAdminPanel = withAuthGuard(AdminPanel, {
  redirectTo: "/admin-login"
});
```

### Manual Redirect Control

```tsx
import { useAuthGuard } from "@/components/auth-guard";

function MyComponent() {
  const { isAuthenticated, requireAuth, handleUnauthorized } = useAuthGuard();
  
  const handleSensitiveAction = () => {
    if (!requireAuth()) {
      return; // Already redirected to login
    }
    
    // Proceed with authenticated action
    performSensitiveOperation();
  };
  
  return (
    <button onClick={handleSensitiveAction}>
      Sensitive Action
    </button>
  );
}
```

The system provides a complete authentication flow with intelligent navigation and proper connection sequencing, ensuring users always end up in the right place at the right time, and never experience incomplete login states.

## Connection Sequence Details

The login process follows a specific sequence to ensure reliability:

```
1. User submits credentials
2. API login call (validates credentials) 
3. Session token saved to localStorage
4. WebSocket connection initiated
5. "connecting" event fired
6. "connected" event fired  
7. "ready" event fired (user data received)
8. Login promise resolves
9. Redirect to intended destination
```

If any step fails or times out (15 seconds), the login is aborted and the user receives appropriate error feedback. This prevents partial login states where the user appears logged in but the client isn't properly connected.