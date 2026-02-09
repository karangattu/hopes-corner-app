/**
 * Mock for next-auth/react used in Playwright Component Testing.
 *
 * Components like ShowerBookingModal and LaundryBookingModal call
 * `useSession()` to determine the user role. This mock returns a
 * configurable session so story wrappers can control the role.
 */

// Global variable that story wrappers can mutate before mounting
let _mockSession: any = {
  data: {
    user: { role: 'checkin', email: 'test@test.com', name: 'Test User' },
    expires: '2099-01-01',
  },
  status: 'authenticated',
};

export function __setMockSession(session: any) {
  _mockSession = session;
}

export function useSession() {
  return _mockSession;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return children;
}

export function signIn() {
  return Promise.resolve();
}

export function signOut() {
  return Promise.resolve();
}

export function getSession() {
  return Promise.resolve(_mockSession?.data ?? null);
}
