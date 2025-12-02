import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const couchdbUrl = new URL(
      `${process.env.NEXT_PUBLIC_COUCHDB_URL}/${process.env.COUCHDB_DB}/_design/driver/_view/by_phoneNumber`
    );

    couchdbUrl.searchParams.append("include_docs", "true");
    couchdbUrl.searchParams.append("inclusive_end", "true");
    couchdbUrl.searchParams.append("skip", "0");
    couchdbUrl.searchParams.append("limit", "101");
    couchdbUrl.searchParams.append("reduce", "false");

    const username = process.env.COUCHDB_USERNAME!;
    const password = process.env.COUCHDB_PASSWORD!;

    const res = await fetch(couchdbUrl.toString(), {
      method: "GET",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${username}:${password}`).toString("base64"),
      },
    });

    const data = await res.json();

    const drivers = data.rows.map((row: any) => ({
      id: row.id,
      name: row.doc.nickname,
      idNumber: row.doc.driverId,
      description: row.doc.desc,
      status: row.doc.status === "OFFLINE" ? "inactive" : "active",
      phone: row.doc.phoneNumber,
    }));

    return NextResponse.json(drivers);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
