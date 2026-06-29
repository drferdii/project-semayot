import { NextResponse } from 'next/server';
import { streamText } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { createClient } from '@/lib/admin/supabase/server';
import { aggregateSummary, formatSummaryForPrompt } from '@/lib/admin/ai/aggregate';
import { ADMIN_AI_SYSTEM_PROMPT } from '@/lib/admin/ai/prompts';

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY! });

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: { code: 'UNAUTHORIZED', message: 'Sesi habis.' } }, { status: 401 });
  }

  const { data: role, error: roleErr } = await supabase.rpc('current_user_role');
  if (roleErr || role !== 'owner') {
    return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Hanya owner.' } }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const messages = body.messages as Array<{ role: 'user' | 'assistant'; content: string }> | undefined;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'messages required' } }, { status: 400 });
  }

  const summary = await aggregateSummary('today');
  const context = formatSummaryForPrompt(summary);

  const systemWithContext = `${ADMIN_AI_SYSTEM_PROMPT}\n\nDATA BISNIS HARI INI:\n${context}`;

  try {
    const result = streamText({
      model: openrouter('mistralai/mistral-7b-instruct:free'),
      system: systemWithContext,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: 0.7,
      maxOutputTokens: 500,
    });

    return result.toUIMessageStreamResponse();
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Gagal chat';
    return NextResponse.json(
      { error: { code: 'AI_ERROR', message: msg } },
      { status: 500 }
    );
  }
}
