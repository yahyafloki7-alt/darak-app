import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("plan");

  if (!file) {
    return NextResponse.json({ error: "لم يتم إرسال أي ملف" }, { status: 400 });
  }

  const mockDetection = {
    area: 142,
    confidence: "عالية",
    rooms: [
      { name: "الصالون", coordinates: { x: 0, y: 0, w: 6, h: 5 } },
      { name: "المطبخ", coordinates: { x: 6, y: 0, w: 4, h: 5 } },
      { name: "غرفة 1", coordinates: { x: 0, y: 5, w: 4, h: 6 } },
      { name: "غرفة 2", coordinates: { x: 4, y: 5, w: 6, h: 6 } },
    ],
    doorsWindows: 11,
  };

  return NextResponse.json(mockDetection);
}
