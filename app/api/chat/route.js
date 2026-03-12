import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ChatSession from '@/lib/models/ChatSession';
import { SYSTEM_PROMPT } from '@/lib/systemPrompt';
import nodemailer from 'nodemailer';

export async function POST(request) {
  console.log('--- MAYA API CALLED ---');
  try {
    const { sessionId, message } = await request.json();
    console.log('Session ID:', sessionId);
    console.log('User Message:', message);

    if (!sessionId || !message?.trim()) {
      console.log('Validation failed: missing sessionId or message');
      return NextResponse.json(
        { error: 'sessionId and message are required' },
        { status: 400 }
      );
    }

    // ── Connect to MongoDB ──────────────────────────────────────
    await connectDB();

    // Load or create session
    let session = await ChatSession.findOne({ sessionId });
    if (!session) {
      session = new ChatSession({
        sessionId,
        messages: [],
        metadata: {
          userAgent: request.headers.get('user-agent') || '',
          ip: request.headers.get('x-forwarded-for') || 'unknown',
        },
      });
    }

    // Append user message
    session.messages.push({ role: 'user', content: message });

    // Build conversation for Sarvam (keep history small to avoid 502/token errors)
    // CRITICAL: Sarvam requires the first message to be from the 'user'.
    // We skip any leading 'assistant' messages (like the initial greeting).
    let history = session.messages.slice(-10);
    while (history.length > 0 && history[0].role === 'assistant') {
      history.shift();
    }

    const recentMessages = history.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // ── Call Sarvam AI ──────────────────────────────────────────
    const sarvamRes = await fetch('https://api.sarvam.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SARVAM_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'sarvam-m',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...recentMessages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
      })
    });

    if (!sarvamRes.ok) {
      const errText = await sarvamRes.text();
      console.error('[Maya] Sarvam error STATUS:', sarvamRes.status);
      console.error('[Maya] Sarvam error BODY:', errText);
      console.error('[Maya] Messages sent:', JSON.stringify(recentMessages.slice(-3)));
      return NextResponse.json(
        { error: `Sarvam API error: ${sarvamRes.status}`, details: errText },
        { status: 502 }
      );
    }

    const sarvamData = await sarvamRes.json();
    let reply = sarvamData?.choices?.[0]?.message?.content || '';

    // Strip <think> reasoning blocks but keep content if incomplete
    reply = reply
      .replace(/<think>[\s\S]*?<\/think>/gi, '') // Remove complete think blocks
      .replace(/<\/?think>/gi, '')               // Remove any stray or incomplete tags
      .trim();

    // ── Parse Actions ───────────────────────────────────────────
    const VALID_ACTIONS = ['assign', 'unassign', 'resolve'];
    let parsedAction = null;
    let finalMessage = reply;

    if (!reply) {
      // Fallback if AI gives an empty response or just think tags
      finalMessage = "I'm sorry, I'm having a technical glitch. Could you please repeat that?";
    }

    try {
      // Find JSON block even if the AI adds text before or after it
      const jsonMatch = reply.match(/\{[\s\S]*\}/);
      const cleanJson = jsonMatch ? jsonMatch[0] : reply;

      const actionObj = JSON.parse(cleanJson);

      if (actionObj && typeof actionObj === 'object') {
        const action = (actionObj.action || '').trim().toLowerCase();

        if (VALID_ACTIONS.includes(action)) {
          // Real action — use it and extract the clean message
          parsedAction = action;
          finalMessage = actionObj.message || reply;
        } else if (actionObj.message) {
          // AI returned JSON with no/invalid action — just show the message
          finalMessage = actionObj.message;
        }
      }
    } catch {
      // Not valid JSON — use the raw reply as-is
    }

    // If the action is assign, send an email to the support team
    if (parsedAction === 'assign' || parsedAction === 'unassign') {
      try {
        const transport = nodemailer.createTransport({
          host: "smtp.zeptomail.in",
          port: 587,
          auth: {
            user: "emailapikey",
            pass: "PHtE6r0NR7voimAm9RNV5/6wEcajN9ws+LhvKVJA5dtLDKcASU1Xqd4rkT7hqh54VaQXRqOSm95o5OzNs7jTdGm/NmxPVWqyqK3sx/VYSPOZsbq6x00auVkefkPbU4frctZo0C3RuNjbNA=="
          }
        });

        // Search for user details in history (last 20 messages for context)
        let leadName = 'Not provided';
        let leadEmail = 'Not provided';
        let leadWhatsApp = 'Not provided';

        session.messages.forEach(m => {
          if (m.role === 'user') {
            const txt = m.content;
            // Simple extraction
            const emailMatch = txt.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            const waMatch = txt.match(/(\+?\d[\d\s-]{8,}\d)/);
            if (emailMatch && leadEmail === 'Not provided') leadEmail = emailMatch[0];
            if (waMatch && leadWhatsApp === 'Not provided') leadWhatsApp = waMatch[0];
            // Name is harder, but look for keywords or short first lines
            if (txt.toLowerCase().includes('name is ')) {
              leadName = txt.split(/name is /i)[1]?.split(/[\n,.]/)[0].trim();
            } else if (leadName === 'Not provided' && txt.length < 30 && !txt.includes('@')) {
              leadName = txt.trim();
            }
          }
        });

        // Full history for the email
        const fullHistory = session.messages;

        const historyHtml = fullHistory.map(m =>
          `<p style="margin:5px 0; font-family:sans-serif;">
            <b style="color:${m.role === 'user' ? '#2563eb' : '#059669'}">${m.role === 'user' ? 'User' : 'Maya'}:</b> 
            ${m.content}
          </p>`
        ).join('');

        const mailOptions = {
          from: '"Splashify Pro Support" <noreply@splashifypro.in>',
          to: 'sayan@splashifypro.in',
          subject: `[Escalation] New Lead: ${leadName} (${sessionId})`,
          html: `
            <div style="font-family:sans-serif; line-height:1.5; color:#333;">
              <h2 style="color:#2563eb;">Support Escalation Required</h2>
              <p>Maya has escalated a conversation. Here are the captured user details:</p>
              
              <div style="background:#f1f5f9; padding:20px; border-radius:8px; border:1px solid #cbd5e1; margin:20px 0;">
                <h3 style="margin-top:0;">📋 Lead Information</h3>
                <p><strong>Name:</strong> ${leadName}</p>
                <p><strong>Email:</strong> ${leadEmail}</p>
                <p><strong>WhatsApp:</strong> ${leadWhatsApp}</p>
                <p><strong>Session ID:</strong> ${sessionId}</p>
              </div>

              <hr style="border:0; border-top:1px solid #e2e8f0; margin:30px 0;"/>
              
              <h3>💬 Full Chat Transcript</h3>
              <div style="background:#fff; padding:20px; border:1px solid #e2e8f0; border-radius:8px;">
                ${historyHtml}
              </div>
              
              <p style="margin-top:30px; font-size:12px; color:#94a3b8;">
                This is an automated notification from Splashify Pro Maya AI.
              </p>
            </div>
          `,
        };

        transport.sendMail(mailOptions).catch(err => console.error('[Maya] Email send error:', err));
        console.log('[Maya] Escalation email triggered to support@splashifypro.in');
      } catch (e) {
        console.error('[Maya] Nodemailer setup error:', e);
      }
    }

    // ── Save assistant reply to MongoDB ──────────────────────────
    session.messages.push({ role: 'assistant', content: finalMessage });
    await session.save();

    return NextResponse.json({
      reply: finalMessage,
      sessionId,
      messageCount: session.messages.length,
      usage: sarvamData.usage,
    });

  } catch (err) {
    console.error('[Maya] /api/chat error:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    );
  }
}
