// app/api/uploads/[filename]/route.ts

import { NextResponse } from "next/server";
import { Readable } from "stream";
import { GridFSBucket } from "mongodb";


type Params = {
  params: { filename: string };
};

export async function GET(req: Request, { params }: Params) {
  try {
    // ensure DB is connected and bucket is available
    const bucket = (globalThis as { bucket: GridFSBucket }).bucket;
    const Parms = await params;
    if (!bucket) {
      console.error("GridFS bucket not found after connectToDb()");
      return new NextResponse(null, { status: 500, statusText: "Server error" });
    }

    const filename = Parms?.filename as string;
    if (!filename) {
      return new NextResponse(null, { status: 400, statusText: "Bad Request" });
    }

    const files = await bucket.find({ filename }).toArray();
    if (!files.length) {
      return new NextResponse(null, { status: 404, statusText: "Not found" });
    }

    const file = files[0];

    // stream the GridFS file to the client (Node -> Web ReadableStream)
    const nodeStream = bucket.openDownloadStreamByName(filename);
    const webStream = Readable.toWeb(nodeStream);

    const contentType = (file.contentType as string) || "application/octet-stream";
    const disposition = `attachment; filename*=UTF-8''${encodeURIComponent(file.filename)}`;

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Content-Disposition": disposition,
      "FileName": file.filename,
    };

    if (typeof file.length === "number") headers["Content-Length"] = String(file.length);

    return new NextResponse(webStream as unknown as ReadableStream, { headers });
  } catch (err) {
    console.error("Download error:", err);
    return new NextResponse(null, { status: 500, statusText: "Server error" });
  }
}
 