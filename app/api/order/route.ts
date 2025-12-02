import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const startKey = searchParams.get("startKey");
    const endKey = searchParams.get("endKey");

   const couchdbUrl = new URL(
  `${process.env.NEXT_PUBLIC_COUCHDB_URL}/${process.env.COUCHDB_DB}/_design/order/_view/by_date`
);
couchdbUrl.searchParams.append('inclusive_end', 'true');
couchdbUrl.searchParams.append('start_key', startKey!);
couchdbUrl.searchParams.append('end_key', endKey!);
couchdbUrl.searchParams.append('skip', '0');
couchdbUrl.searchParams.append('limit', '21');
couchdbUrl.searchParams.append('reduce', 'false');

    const username = process.env.COUCHDB_USERNAME!;
    const password = process.env.COUCHDB_PASSWORD!;

    const response = await fetch(couchdbUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
      },
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
