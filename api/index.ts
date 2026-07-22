import { createApp } from "./_lib/app";

// Vercel's Node.js runtime accepts a plain (req, res) handler, and an Express
// app instance is exactly that — so we can export it directly. All requests to
// /api/* are routed here by vercel.json's rewrite rule.
const app = createApp();

export default app;
