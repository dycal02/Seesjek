import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Ambil query ?page & ?limit
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const skip = (page - 1) * limit;

    // CouchDB URL
    const url = `${process.env.NEXT_PUBLIC_COUCHDB_URL}/${process.env.COUCHDB_DB}/_design/user/_view/by_phoneNumber?reduce=false&include_docs=true&skip=${skip}&limit=${limit}`;

    // Auth
    const authString = Buffer.from(
      `${process.env.COUCHDB_USERNAME}:${process.env.COUCHDB_PASSWORD}`
    ).toString("base64");

    // Fetch
    const res = await fetch(url, {
      headers: {
        Authorization: `Basic ${authString}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("CouchDB Error:", await res.text());
      return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
    }

    const data = await res.json();

    // Mapping data
    const customers = data.rows.map((item: any) => {
      const doc = item.doc;
      return {
        id: doc._id,
        name: doc.name || "Unknown",
        phone: doc.phoneNumber || "-",
        status: doc.status || "inactive",
      };
    });

    // Total data menggunakan metadata CouchDB
    const total = data.total_rows ?? 0;

    return NextResponse.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: customers,
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
