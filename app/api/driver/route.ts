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

    const username = process.env.COUCHDB_USERNAME || '';
    const password = process.env.COUCHDB_PASSWORD || '';

    if (!username || !password) {
      return NextResponse.json(
        { error: "CouchDB credentials not configured" },
        { status: 500 }
      );
    }

    const credentials = Buffer.from(`${username}:${password}`).toString("base64");

    const res = await fetch(couchdbUrl.toString(), {
      method: "GET",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`CouchDB Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // Transform CouchDB response ke format Driver
    const drivers = data.rows.map((row: any) => ({
      id: row.id,
      name: row.doc.nickname || '',
      idNumber: row.doc.driverId || '',
      description: row.doc.desc || '',
      status: row.doc.status === "OFFLINE" ? "inactive" : "active",
      phone: row.doc.phoneNumber || '',
      email: row.doc.email || '',
      vehicle: row.doc.vehicle || '',
      joinDate: row.doc.joinDate || new Date().toISOString().split('T')[0],
    }));

    return NextResponse.json(drivers);
  } catch (err: any) {
    console.error("Driver API Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch drivers" },
      { status: 500 }
    );
  }
}
