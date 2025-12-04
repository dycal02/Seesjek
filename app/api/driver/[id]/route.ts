import { NextResponse } from "next/server";

// UPDATE - Edit driver
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const driverId = params.id;
    const body = await req.json();

    if (!body._rev) {
      return NextResponse.json(
        { error: "_rev diperlukan untuk update" },
        { status: 400 }
      );
    }

    // CouchDB URL
    const url = `${process.env.NEXT_PUBLIC_COUCHDB_URL}/${process.env.COUCHDB_DB}/${driverId}`;

    // Auth
    const authString = Buffer.from(
      `${process.env.COUCHDB_USERNAME}:${process.env.COUCHDB_PASSWORD}`
    ).toString("base64");

    // Siapkan dokumen untuk update
    const updatedDriver = {
      _id: driverId,
      _rev: body._rev,
      type: "driver",
      nickname: body.name,
      driverId: body.idNumber,
      desc: body.description,
      status: body.status === "active" ? "ONLINE" : "OFFLINE",
      phoneNumber: body.phone,
      joinDate: body.joinDate,
      updatedAt: new Date().toISOString(),
    };

    // PUT ke CouchDB
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedDriver),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("CouchDB Error:", error);
      return NextResponse.json({ error: "Gagal mengupdate driver" }, { status: 500 });
    }

    const result = await res.json();

    return NextResponse.json({
      success: true,
      message: "Driver berhasil diupdate",
      rev: result.rev,
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE - Hapus driver
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const driverId = params.id;
    const { searchParams } = new URL(req.url);
    const rev = searchParams.get("_rev");

    if (!rev) {
      return NextResponse.json(
        { error: "_rev diperlukan untuk delete" },
        { status: 400 }
      );
    }

    // CouchDB URL
    const url = `${process.env.NEXT_PUBLIC_COUCHDB_URL}/${process.env.COUCHDB_DB}/${driverId}?rev=${rev}`;

    // Auth
    const authString = Buffer.from(
      `${process.env.COUCHDB_USERNAME}:${process.env.COUCHDB_PASSWORD}`
    ).toString("base64");

    // DELETE ke CouchDB
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${authString}`,
      },
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("CouchDB Error:", error);
      return NextResponse.json({ error: "Gagal menghapus driver" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Driver berhasil dihapus",
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}