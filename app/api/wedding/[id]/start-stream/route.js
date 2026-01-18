import { NextResponse } from 'next/server';
import { getWeddingById, setWeddingActiveStream, createStreamSession } from '@/lib/wedding-service';
import { createLiveStream } from '@/lib/mux';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { guest_id } = await request.json();

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

    // Check if live mode is enabled
    if (!wedding.live_mode_enabled) {
      return NextResponse.json(
        { error: 'Live mode is not enabled for this wedding' },
        { status: 403 }
      );
    }

    // Check if there's already an active stream
    if (wedding.active_stream_id) {
      return NextResponse.json(
        { error: 'A stream is already active' },
        { status: 409 }
      );
    }

    // Create Mux live stream
    const muxData = await createLiveStream();

    if (!muxData.playbackId) {
      return NextResponse.json(
        { error: 'Failed to create playback ID' },
        { status: 500 }
      );
    }

    // Generate playback URL
    const playbackUrl = `https://stream.mux.com/${muxData.playbackId}.m3u8`;

    // Create stream session in database
    const session = await createStreamSession(id, muxData);

    // Update wedding with active stream
    await setWeddingActiveStream(id, muxData.streamId, playbackUrl);

    // Return streaming credentials
    return NextResponse.json({
      success: true,
      stream: {
        stream_id: muxData.streamId,
        stream_key: muxData.streamKey,
        playback_id: muxData.playbackId,
        playback_url: playbackUrl,
        rtmp_url: `rtmp://global-live.mux.com:5222/app/${muxData.streamKey}`,
        session_id: session.id,
      },
    });
  } catch (error) {
    console.error('Error starting stream:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
