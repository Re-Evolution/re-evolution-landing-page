import { NextRequest, NextResponse } from 'next/server';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `És o assistente virtual da Re-Evolution, uma empresa portuguesa de transformação digital especializada em automações, websites e presença digital para pequenas e médias empresas.

SOBRE A RE-EVOLUTION:
- Criamos automações que poupam tempo: quando algo acontece no site (preencher formulário, nova encomenda, etc.), ações automáticas são executadas — emails automáticos, guardar dados em Google Sheets, notificações WhatsApp/Telegram
- Desenvolvemos websites profissionais e landing pages de alta conversão
- Oferecemos diagnósticos gratuitos para perceber as necessidades de cada cliente
- Pacotes: Essencial (€300), Automação (€600), Completo (€1.200) — todos incluem 6 meses de suporte
- Resultados reais: clientes viram +40% reservas e 70% mais leads qualificados
- Portfolio: restaurantes, advogados, consultores imobiliários e outros negócios locais

O TEU OBJETIVO:
1. Cumprimentar e perceber o que o utilizador procura
2. Responder às questões sobre serviços, preços e automações de forma clara e entusiasta
3. Recolher naturalmente o NOME e CONTACTO (email ou telefone) do utilizador
4. Quando tiveres nome E contacto, confirmar que alguém da Re-Evolution irá entrar em contacto brevemente

REGRAS:
- Comunica sempre em português europeu
- Sê simpático, profissional e conciso (máximo 3-4 frases por resposta)
- Não inventes informações que não tens
- Se perguntarem sobre agendamento direto, explica que após recolheres os dados a equipa entrará em contacto para marcar

FORMATO DA RESPOSTA:
Responde SEMPRE com um objeto JSON válido com exatamente esta estrutura:
{
  "message": "a tua resposta aqui (usa \\n para quebras de linha)",
  "lead": {
    "name": "nome do cliente",
    "contact": "email ou telefone",
    "interest": "resumo do que procura em 1 frase"
  }
}

IMPORTANTE: O campo "lead" só deve ser incluído quando tiveres CONFIRMADO o nome E o contacto (email ou telefone) do utilizador. Antes disso, omite completamente o campo "lead".`;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const messages: Message[] = body?.messages;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'messages array is required' }, { status: 400 });
  }

  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    return NextResponse.json({ error: 'GROQ_API_KEY is not configured' }, { status: 500 });
  }

  let groqRes: Response;
  try {
    groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 500,
      }),
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    return NextResponse.json({ error: 'Could not reach Groq API' }, { status: 502 });
  }

  if (!groqRes.ok) {
    const errorText = await groqRes.text();
    console.error('Groq error:', errorText);
    return NextResponse.json({ error: `Groq returned ${groqRes.status}` }, { status: 502 });
  }

  const groqData = await groqRes.json();
  const rawContent: string = groqData.choices?.[0]?.message?.content ?? '';

  let parsed: { message: string; lead?: { name: string; contact: string; interest: string } };
  try {
    parsed = JSON.parse(rawContent);
  } catch {
    parsed = { message: rawContent || 'Desculpe, ocorreu um erro. Tente novamente.' };
  }

  // When lead data is collected, notify via Make.com (fire-and-forget)
  if (parsed.lead?.name && parsed.lead?.contact) {
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: parsed.lead.name,
          contact: parsed.lead.contact,
          interest: parsed.lead.interest ?? '',
          timestamp: new Date().toISOString(),
          source: 'chatbot',
        }),
      }).catch(console.error);
    }
  }

  return NextResponse.json({ message: parsed.message });
}
