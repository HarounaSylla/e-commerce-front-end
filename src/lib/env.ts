export const env = {
  backendUrl: import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000",
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "",
};