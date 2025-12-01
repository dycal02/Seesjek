import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const skip = searchParams.get("skip") || "0";
    const limit = searchParams.get("limit") || "101";

    const url = `${process.env.NEXT_PUBLIC_COUCHDB_URL}/seesjek/_design/order/_view/by_date?reduce=false&include_docs=true&skip=${skip}&limit=${limit}`;

    const authString = Buffer.from(
      `${process.env.NEXT_PUBLIC_COUCHDB_USERNAME}:${process.env.NEXT_PUBLIC_COUCHDB_PASSWORD}`
    ).toString("base64");

    const res = await fetch(url, {
      headers: {
        Authorization: `Basic ${authString}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("CouchDB Error:", await res.text());
      return NextResponse.json(
        { error: "Failed to fetch from CouchDB" },
        { status: 500 }
      );
    }

    const data = await res.json();

    const orders = data.rows.map((item: any) => {
      const doc = item.doc;

      return {
        id: doc._id,                      // UNIK
        date: doc.date ?? "-",            // string
        total: 1,                         // 1 dokumen = 1 order
        customer: doc.orderData?.nama ?? "-",
        status: doc.status ?? "unknown",
      };
    });

    return NextResponse.json({ orders });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
