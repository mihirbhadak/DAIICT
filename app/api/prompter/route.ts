import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

export async function POST(request: Request) {
  const { messages } = await request.json();

  if (!messages) {
    return NextResponse.json({ error: 'Messages field is required' }, { status: 400 });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "writer/palmyra-med-70b-32k",
      messages,
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    const responseChunks = [];
    for await (const chunk of completion) {
      responseChunks.push(chunk.choices[0]?.delta?.content || '');
    }

    return NextResponse.json({ content: responseChunks.join('') });
  } catch (error) {
    console.error('Error fetching completion:', error);
    return NextResponse.json({ error: 'Failed to fetch completion' }, { status: 500 });
  }
}