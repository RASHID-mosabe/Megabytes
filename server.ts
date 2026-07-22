import path from "path";
import { createServer as createViteServer } from "vite";
import { createApp } from "./api/_lib/app";

const PORT = Number(process.env.PORT) || 3000;

// Local development / traditional Node hosting (Cloud Run, Render, Railway, etc.)
// entrypoint. Vercel does NOT use this file — it calls api/index.ts as a
// serverless function instead. Both share the same route logic via createApp().
async function startServer() {
  const app = createApp();

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const express = (await import("express")).default;
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
