import Mux from '@mux/mux-node';

const { Video } = Mux;

// Initialize Mux with API credentials (only if both are provided)
const hasMuxCredentials = process.env.MUX_TOKEN_ID && process.env.MUX_TOKEN_SECRET;
const mux = hasMuxCredentials 
  ? new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET)
  : null;

/**
 * Create a new Mux Live Stream
 * @returns {Promise<{streamId: string, streamKey: string, playbackId: string, rtmpUrl: string}>}
 */
export async function createLiveStream() {
  if (!mux) {
    console.warn('Mux credentials not configured, returning mock stream data');
    // Return mock data for development/testing
    return {
      streamId: 'mock_stream_' + Date.now(),
      streamKey: 'mock_stream_key',
      playbackId: 'mock_playback_id',
      rtmpUrl: 'rtmp://mock.rtmp.url',
    };
  }
  
  try {
    const liveStream = await Video.LiveStreams.create({
      playback_policy: ['public'],
      new_asset_settings: {
        playback_policy: ['public'],
      },
    });

    return {
      streamId: liveStream.id,
      streamKey: liveStream.stream_key,
      playbackId: liveStream.playback_ids?.[0]?.id || null,
      rtmpUrl: liveStream.reconnect_window || null,
    };
  } catch (error) {
    console.error('Error creating Mux live stream:', error);
    throw new Error('Failed to create live stream');
  }
}

/**
 * Disable/End a Mux Live Stream
 * @param {string} streamId - The Mux stream ID
 */
export async function disableLiveStream(streamId) {
  if (!mux) {
    console.warn('Mux credentials not configured, skipping stream disable');
    return;
  }
  try {
    await Video.LiveStreams.disable(streamId);
  } catch (error) {
    console.error('Error disabling Mux live stream:', error);
    throw new Error('Failed to disable live stream');
  }
}

/**
 * Get live stream status
 * @param {string} streamId - The Mux stream ID
 */
export async function getLiveStreamStatus(streamId) {
  if (!mux) {
    console.warn('Mux credentials not configured, returning mock status');
    return {
      status: 'active',
      active: true,
    };
  }
  
  try {
    const liveStream = await Video.LiveStreams.retrieve(streamId);
    return {
      status: liveStream.status,
      active: liveStream.status === 'active',
    };
  } catch (error) {
    console.error('Error getting live stream status:', error);
    throw new Error('Failed to get live stream status');
  }
}
