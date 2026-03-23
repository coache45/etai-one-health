import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Verify webhook signature, route to appropriate handler
    void body;

    return NextResponse.json(
      { error: 'Not implemented', message: 'Webhook handler stub' },
      { status: 501 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
