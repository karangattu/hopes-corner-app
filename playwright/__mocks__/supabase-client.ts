/**
 * Stub for @/lib/supabase/client used in Playwright Component Testing.
 *
 * Returns a no-op Supabase client so store actions that lazily call
 * `createClient()` don't crash. The story wrappers seed store state
 * directly via `setState()` instead of going through Supabase.
 */

const noopChain: any = new Proxy(
  () => noopChain,
  {
    get: () => noopChain,
    apply: () => noopChain,
  }
);

// Make the proxy also resolve as a promise (for `await supabase.from(...).select()`)
const noopPromise: any = new Proxy(
  () => noopPromise,
  {
    get: (_target, prop) => {
      if (prop === 'then') return undefined; // makes it non-thenable at base level
      if (prop === 'data') return [];
      if (prop === 'error') return null;
      return noopPromise;
    },
    apply: () => {
      // When called as a function, return a thenable with empty data
      return {
        data: [],
        error: null,
        then: (cb: any) => Promise.resolve(cb({ data: [], error: null })),
      };
    },
  }
);

export function createClient() {
  return new Proxy({}, {
    get: (_target, prop) => {
      if (prop === 'from') {
        return () => ({
          select: () => ({ data: [], error: null, then: (cb: any) => Promise.resolve(cb({ data: [], error: null })) }),
          insert: () => ({ data: [], error: null, then: (cb: any) => Promise.resolve(cb({ data: [], error: null })) }),
          update: () => ({ data: [], error: null, then: (cb: any) => Promise.resolve(cb({ data: [], error: null })) }),
          delete: () => ({ data: [], error: null, then: (cb: any) => Promise.resolve(cb({ data: [], error: null })) }),
          upsert: () => ({ data: [], error: null, then: (cb: any) => Promise.resolve(cb({ data: [], error: null })) }),
        });
      }
      if (prop === 'channel') {
        return () => ({
          on: function() { return this; },
          subscribe: () => ({ unsubscribe: () => {} }),
        });
      }
      if (prop === 'removeChannel') {
        return () => {};
      }
      return () => ({ data: [], error: null });
    },
  });
}
