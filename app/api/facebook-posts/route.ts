import { NextResponse } from 'next/server';

// Define more specific types
interface FacebookPost {
  id: string;
  message: string | null;
  full_picture?: string | null;
  created_time: string;
}

interface FacebookPageData {
  id: string;
  access_token: string;
  name: string;
}

interface FacebookAPIResponse {
  data: FacebookPost[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
  error?: {
    message: string;
    type: string;
    code: number;
    fbtrace_id: string;
  };
}

interface FacebookPagesResponse {
  data: FacebookPageData[];
  error?: {
    message: string;
    type: string;
    code: number;
  };
}

const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN?.trim();
const FACEBOOK_API_VERSION = 'v19.0';

export async function GET() {
  if (!FACEBOOK_ACCESS_TOKEN) {
    console.error('Missing Facebook access token');
    return NextResponse.json(
      { error: 'Configuration error', data: [] },
      { status: 500 }
    );
  }

  try {
    // First, get the list of pages the user has access to
    const pagesUrl = `https://graph.facebook.com/${FACEBOOK_API_VERSION}/me/accounts?access_token=${FACEBOOK_ACCESS_TOKEN}`;
    const pagesResponse = await fetch(pagesUrl);
    const pagesData = (await pagesResponse.json()) as FacebookPagesResponse;

    if (pagesData.error) {
      console.error('Error fetching pages:', pagesData.error);
      return NextResponse.json(
        { error: pagesData.error.message, data: [] },
        { status: 500 }
      );
    }

    // Get the first page's access token and ID
    const page = pagesData.data?.[0];
    if (!page) {
      return NextResponse.json(
        { error: 'No Facebook pages found', data: [] },
        { status: 404 }
      );
    }

    // Use the page access token to fetch posts
    const url = `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${
      page.id
    }/posts?fields=full_picture,message,created_time&access_token=${
      page.access_token
    }&limit=10`;

    const response = await fetch(url);
    const data = (await response.json()) as FacebookAPIResponse;

    if (data.error) {
      console.error('Facebook API error:', data.error);
      return NextResponse.json(
        { error: data.error.message, data: [] },
        { status: 500 }
      );
    }

    // Filter out posts without a message and limit to 6 posts
    const filteredPosts =
      data.data
        ?.filter((post) => post.message && post.message.trim() !== '')
        ?.slice(0, 6) || [];

    return NextResponse.json({
      data: filteredPosts,
      paging: data.paging,
    });
  } catch (error) {
    console.error('Error fetching Facebook posts:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch posts',
        data: [],
      },
      { status: 500 }
    );
  }
}
