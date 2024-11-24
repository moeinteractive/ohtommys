import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dataFile = path.join(process.cwd(), 'data', 'content.json');

export async function GET() {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ menuItems: [], events: [] });
  }
}

export async function POST(request: Request) {
  try {
    const content = await request.json();
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify(content, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to save data' },
      { status: 500 }
    );
  }
}
