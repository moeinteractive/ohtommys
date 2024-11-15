import { NextResponse } from 'next/server'

const FACEBOOK_PAGE_ID = 'ohtommys.pubgrill'
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN

export async function GET() {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${FACEBOOK_PAGE_ID}/posts?fields=full_picture,message,created_time&limit=6&access_token=${FACEBOOK_ACCESS_TOKEN}`
    )
    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ data: [] })
  }
} 