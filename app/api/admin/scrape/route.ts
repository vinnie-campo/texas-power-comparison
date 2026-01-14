import { NextRequest, NextResponse } from 'next/server';
import { runFullScrape } from '@/lib/scraper/scraper-service';

/**
 * POST /api/admin/scrape
 * Trigger a scrape of Power to Choose data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const autoApply = body.autoApply === true;

    console.log(`🔄 Admin scrape triggered (autoApply: ${autoApply})`);

    // Run the scrape
    const session = await runFullScrape(autoApply);

    return NextResponse.json({
      success: session.status === 'completed',
      session,
    });
  } catch (error) {
    console.error('Error in POST /api/admin/scrape:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/scrape
 * Get information about the scraper
 */
export async function GET() {
  return NextResponse.json({
    status: 'ready',
    description: 'Power to Choose scraper API',
    endpoints: {
      POST: 'Trigger a new scrape',
    },
    parameters: {
      autoApply: 'boolean - Automatically apply changes to database (default: false)',
    },
  });
}
