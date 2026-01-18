import { NextResponse } from 'next/server';
import { getWeddingById, createGuest, createOrGetWedding } from '@/lib/wedding-service';

export async function POST(request) {
  try {
    const { guest_name } = await request.json();

    if (!guest_name) {
      return NextResponse.json(
        { error: 'Guest name is required' },
        { status: 400 }
      );
    }

    // Use default wedding ID (same as admin uses)
    const weddingId = 'love2024_kc_wedding';
    
    // Get or create wedding
    let wedding;
    try {
      wedding = await getWeddingById(weddingId);
      if (!wedding) {
        wedding = await createOrGetWedding(weddingId);
      }
    } catch (error) {
      console.warn('Error getting wedding, creating new one:', error);
      wedding = await createOrGetWedding(weddingId);
    }

    if (!wedding) {
      return NextResponse.json(
        { error: 'Failed to access wedding' },
        { status: 500 }
      );
    }

    // Create guest
    const guest = await createGuest(wedding.id, guest_name);

    // Return wedding info with live mode status
    return NextResponse.json({
      success: true,
      guest: {
        id: guest.id,
        name: guest.name,
      },
      wedding: {
        id: wedding.id,
        couple_names: wedding.couple_names || 'The Couple',
        ceremony_start_time: wedding.ceremony_start_time?.toDate?.()?.toISOString() || wedding.ceremony_start_time,
        ceremony_end_time: wedding.ceremony_end_time?.toDate?.()?.toISOString() || wedding.ceremony_end_time,
        live_mode_enabled: wedding.live_mode_enabled || false,
        active_stream_id: wedding.active_stream_id || null,
        playback_url: wedding.playback_url || null,
      },
    });
  } catch (error) {
    console.error('Error in guest auth:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
