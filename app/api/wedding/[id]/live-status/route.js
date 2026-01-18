import { NextResponse } from 'next/server';
import { getWeddingById, getActiveStreamSession, createOrGetWedding } from '@/lib/wedding-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Wedding ID is required' },
        { status: 400 }
      );
    }

    // Create wedding if it doesn't exist (for mock/testing)
    let wedding;
    try {
      wedding = await getWeddingById(id);
    } catch (e) {
      console.warn('Error fetching wedding (will try create/fallback):', e);
      wedding = null;
    }

    if (!wedding) {
      // Try to create it
      try {
        wedding = await createOrGetWedding(id);
      } catch (createError) {
        console.warn('Could not create wedding, returning defaults:', createError);
        // Return default values if creation fails
        return NextResponse.json({
          live_mode_enabled: false,
          is_stream_active: false,
          playback_url: null,
          stream_session: null,
        });
      }
    }

    const isStreamActive = !!wedding.active_stream_id;
    let streamSession = null;

    if (isStreamActive) {
      try {
        streamSession = await getActiveStreamSession(id);
      } catch (e) {
        console.warn('Error fetching stream session:', e);
      }
    }

    return NextResponse.json({
      live_mode_enabled: wedding.live_mode_enabled || false,
      is_stream_active: isStreamActive,
      playback_url: wedding.playback_url || null,
      stream_session: streamSession ? {
        id: streamSession.id,
        status: streamSession.status,
        mux_playback_id: streamSession.mux_playback_id,
      } : null,
    });
  } catch (error) {
    console.error('Error getting live status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
