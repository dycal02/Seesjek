import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || "";
    const type = searchParams.get("type") || "daily";
    const skip = searchParams.get("skip");
    const limit = searchParams.get("limit");

    const url = new URL(`${process.env.NEXT_PUBLIC_COUCHDB_URL}/seesjek/_design/order/_view/by_date?reduce=false&include_docs=true`);

    const dates = new Date(date);
    const format =  (d: Date) => d.toISOString().split("T")[0];

    switch (type) {
      case "daily":
        // For daily, we can use the date as is
      url.searchParams.append('start_key', `["${date}", null]`);
      url.searchParams.append('end_key', `["${date}", {}]`);
        break;
      case "weekly":
        // For weekly, calculate the start of the week (Monday)

        const day = dates.getDay() === 0 ? 7 : dates.getDay();
        const monday = new Date(dates);
        monday.setDate(dates.getDate() - (day - 1));

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);


        url.searchParams.append('start_key', `["${format(monday)}", null]`);
        url.searchParams.append('end_key', `["${format(sunday)}", {}]`);
      break;
      case "monthly":
        // For monthly, calculate the first day of the month
        const firstDay = new Date(dates.getFullYear(), dates.getMonth(), 2);
        const lastDay = new Date(dates.getFullYear(), dates.getMonth() + 1, 1);

        url.searchParams.append('start_key', `["${format(firstDay)}", null]`);
        url.searchParams.append('end_key', `["${format(lastDay)}", {}]`);
        break;
    }
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

    return NextResponse.json({ orders,start_key: url.searchParams.get('start_key'),end_key: url.searchParams.get('end_key') });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
