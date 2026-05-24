// Stub for local development — real package provided by Vercel at deploy time
declare module "@vercel/analytics/next" {
  export function Analytics(props?: Record<string, unknown>): JSX.Element | null;
}
