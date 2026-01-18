import { NextResponse } from 'next/server';
import { getWeddingById, clearWeddingActiveStream, getActiveStreamSession, updateStreamSessionStatus } from '@/lib/wedding-service';
import { disableLiveStream } from '@/lib/mux';

export async function POST(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Wedding ID is required' },
        { status: 400 }
      );
    }

    const wedding = await getWeddingById(id);

    if (!wedding) {
      return NextResponse.json(
        { error: 'Wedding not found' },
        { status: 404 }
      );
    }

    if (!wedding.active_stream_id) {
      return NextResponse.json(
        { error: 'No active stream to end' },
        { status: 404 }
      );
    }

    // Get stream session
    const streamSession = await getActiveStreamSession(id);

    if (streamSession) {
      // Disable Mux stream
      try {
        await disableLiveStream(streamSession.mux_stream_id);
      } catch (muxError) {
        console.error('Error disabling Mux stream:', muxError);
        // Continue even if Mux fails
      }

      // Update stream session status
      await updateStreamSessionStatus(streamSession.id, 'ended', true);
    }

    // Clear active stream from wedding
    await clearWeddingActiveStream(id);

    return NextResponse.json({
      success: true,
      message: 'Stream ended successfully',
    });
  } catch (error) {
    console.error('Error ending stream:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
