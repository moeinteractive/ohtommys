import { NextResponse } from 'next/server'
import crypto from 'crypto'

const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN?.trim()
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET?.trim()
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID || '1593835144220131'
const FACEBOOK_API_VERSION = 'v19.0'

export async function GET() {
  if (!FACEBOOK_ACCESS_TOKEN) {
    console.error('Missing Facebook access token')
    return NextResponse.json(
      { error: 'Missing Facebook access token' }, 
      { status: 500 }
    )
  }

  try {
    // First, get the list of pages the user has access to
    const pagesUrl = `https://graph.facebook.com/${FACEBOOK_API_VERSION}/me/accounts?access_token=${FACEBOOK_ACCESS_TOKEN}`
    const pagesResponse = await fetch(pagesUrl)
    const pagesData = await pagesResponse.json()
    
    console.log('Pages data:', pagesData)

    if (pagesData.error) {
      console.error('Error fetching pages:', pagesData.error)
      return NextResponse.json(
        { error: pagesData.error.message },
        { status: 500 }
      )
    }

    // Get the first page's access token and ID
    const page = pagesData.data?.[0]
    if (!page) {
      return NextResponse.json(
        { error: 'No Facebook pages found' },
        { status: 404 }
      )
    }

    // Use the page access token to fetch posts
    const url = `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${page.id}/posts?fields=full_picture,message,created_time&access_token=${page.access_token}&limit=6`
    
    const response = await fetch(url)
    const data = await response.json()

    if (data.error) {
      console.error('Facebook API error:', data.error)
      return NextResponse.json(
        { error: data.error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching Facebook posts:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch Facebook posts' }, 
      { status: 500 }
    )
  }
} 