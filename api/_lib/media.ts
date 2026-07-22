import fs from "fs";
import path from "path";
import multer from "multer";

export const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Same reasoning as store.ts: Vercel's filesystem isn't writable/persistent in
// production, so uploaded images must go to Vercel Blob storage instead of disk.
// Locally, we keep saving to public/uploads exactly like before.
export const useBlob = !!process.env.VERCEL;

if (!useBlob && !fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// multer storage: memory on Vercel (so we can forward the buffer to Blob),
// disk locally (so files land straight in public/uploads like before).
export const uploadMiddleware = multer({
  storage: useBlob
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
        filename: (_req, file, cb) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          cb(null, `file-${uniqueSuffix}${ext}`);
        },
      }),
});

export interface MediaFile {
  id: string;
  filename: string;
  url: string;
  size: string;
  createdAt: string;
}

export async function listMediaFiles(): Promise<MediaFile[]> {
  if (useBlob) {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "uploads/" });
    return blobs.map((b) => ({
      id: b.pathname.replace(/^uploads\//, ""),
      filename: b.pathname.replace(/^uploads\//, ""),
      url: b.url,
      size: (b.size / 1024).toFixed(1) + " KB",
      createdAt: b.uploadedAt instanceof Date ? b.uploadedAt.toISOString() : String(b.uploadedAt),
    }));
  }

  const files = fs.readdirSync(UPLOADS_DIR);
  return files.map((file) => {
    const filePath = path.join(UPLOADS_DIR, file);
    const stats = fs.statSync(filePath);
    return {
      id: file,
      filename: file,
      url: `/uploads/${file}`,
      size: (stats.size / 1024).toFixed(1) + " KB",
      createdAt: stats.birthtime.toISOString(),
    };
  });
}

export async function saveUploadedFile(file: Express.Multer.File): Promise<MediaFile> {
  if (useBlob) {
    const { put } = await import("@vercel/blob");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `file-${uniqueSuffix}${ext}`;
    const blob = await put(`uploads/${filename}`, file.buffer, { access: "public" });
    return {
      id: filename,
      filename,
      url: blob.url,
      size: (file.size / 1024).toFixed(1) + " KB",
      createdAt: new Date().toISOString(),
    };
  }

  return {
    id: file.filename,
    filename: file.filename,
    url: `/uploads/${file.filename}`,
    size: (file.size / 1024).toFixed(1) + " KB",
    createdAt: new Date().toISOString(),
  };
}

export async function deleteMediaFile(filename: string): Promise<boolean> {
  const safeFilename = path.basename(filename);

  if (useBlob) {
    const { list, del } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: `uploads/${safeFilename}` });
    const match = blobs.find((b) => b.pathname === `uploads/${safeFilename}`);
    if (!match) return false;
    await del(match.url);
    return true;
  }

  const filePath = path.join(UPLOADS_DIR, safeFilename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}
