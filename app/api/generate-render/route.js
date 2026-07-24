import { NextResponse } from "next/server";

export async function POST(request) {
  const { detection, style } = await request.json();

  const mockResult = {
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    pdfUrl: "#",
    style,
  };

  return NextResponse.json(mockResult);
}
