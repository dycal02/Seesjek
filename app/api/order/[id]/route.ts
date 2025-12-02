import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const url = `${process.env.COUCHDB_URL}/seesjek/${id}`;

  const headers = {
    Authorization:
      "Basic " +
      Buffer.from(
        `${process.env.COUCHDB_USERNAME}:${process.env.COUCHDB_PASSWORD}`
      ).toString("base64"),
  };

  const res = await fetch(url, { headers });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch CouchDB" }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
