import { connectDB } from "@/lib/db";


export async function GET() {
    try {
        await connectDB();
        return Response.json({ ok: true, db: "connected" });
    } catch (e: unknown) {
        if (e instanceof Error) {
            return Response.json({ ok: false, error: e.message }, { status: 500 });
        }
        return Response.json({ ok: false, error: "Unknown error" }, { status: 500 });
    }
}