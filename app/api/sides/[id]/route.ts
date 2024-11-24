import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// Define the params type with Promise
type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const { data, error } = await supabase
      .from('sides')
      .update(body)
      .eq('id', resolvedParams.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating side' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const { error } = await supabase
      .from('sides')
      .update({ is_active: false })
      .eq('id', resolvedParams.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting side' }, { status: 500 });
  }
}
