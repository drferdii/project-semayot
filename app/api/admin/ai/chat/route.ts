import { NextResponse } from 'next/server';
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createClient } from '@/lib/admin/supabase/server';
import { aggregateSummary, formatSummaryForPrompt } from '@/lib/admin/ai/aggregate';
import { ADMIN_AI_SYSTEM_PROMPT } from '@/lib/admin/ai/prompts';

export async function POST(request: Request) {
  // Check API key early — surface a clean error instead of a cryptic provider crash
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: { code: 'CONFIG_ERROR', message: 'GEMINI_API_KEY belum dikonfigurasi di server.' } },
      { status: 503 }
    );
  }

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
  const rawMessages = body.messages as any[] | undefined;
  if (!rawMessages || !Array.isArray(rawMessages) || rawMessages.length === 0) {
    return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'messages required' } }, { status: 400 });
  }

  // Extract plain text from each message regardless of whether the SDK sent
  // {content: string} (legacy) or {parts: [{type:'text', text:'...'}]} (AI SDK v4+)
  function extractText(m: any): string {
    if (typeof m.content === 'string') return m.content;
    if (Array.isArray(m.parts)) {
      return m.parts
        .filter((p: any) => p.type === 'text')
        .map((p: any) => p.text as string)
        .join('');
    }
    return '';
  }

  // Build CoreMessage[] format that streamText expects
  const coreMessages = rawMessages
    .filter((m: any) => m.role === 'user' || m.role === 'assistant')
    .map((m: any) => ({
      role: m.role as 'user' | 'assistant',
      content: extractText(m),
    }))
    .filter((m) => m.content.length > 0);

  if (coreMessages.length === 0) {
    return NextResponse.json({ error: { code: 'VALIDATION_ERROR', message: 'No valid message content found' } }, { status: 400 });
  }

  const summary = await aggregateSummary('today');
  const context = formatSummaryForPrompt(summary);
  const systemWithContext = `${ADMIN_AI_SYSTEM_PROMPT}\n\nDATA BISNIS HARI INI:\n${context}`;

  const google = createGoogleGenerativeAI({ apiKey });

  try {
    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemWithContext,
      messages: coreMessages,
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
