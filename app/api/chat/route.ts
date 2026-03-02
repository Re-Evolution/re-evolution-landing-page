import { NextRequest, NextResponse } from 'next/server';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Lead {
  name: string;
  contact: string;
  business_type?: string;
  current_situation?: string;
  main_need?: string;
  urgency?: string;
  budget?: string;
  decision_maker?: string;
  interest?: string;
}

const SYSTEM_PROMPT = `És o assistente virtual da Re-Evolution, uma empresa portuguesa de transformação digital especializada em automações, websites e presença digital para pequenas e médias empresas.

SOBRE A RE-EVOLUTION:
- Criamos automações que poupam tempo: quando algo acontece no site (preencher formulário, nova encomenda, etc.), ações automáticas são executadas — emails automáticos, guardar dados em Google Sheets, notificações WhatsApp/Telegram
- Desenvolvemos websites profissionais e landing pages de alta conversão
- Oferecemos diagnósticos gratuitos para perceber as necessidades de cada cliente
- Pacotes: Website Essencial (€500, inclui 1 mês de suporte), Automação Managed (€800 + €140/mês) - Add-ons disponíveis: Chatbot AI, WhatsApp Business API, Relatórios Avançados
- Resultados reais: clientes viram +40% reservas e 70% mais leads qualificados
- Portfolio: restaurantes, advogados, consultores imobiliários e outros negócios locais

O TEU OBJETIVO:
Guia a conversa de forma natural para recolher os seguintes dados, um de cada vez e sem pressionar:

1. Perceber a NECESSIDADE — o que os está a travar? (sem website, tarefas manuais a mais, poucos leads, etc.)
2. TIPO DE NEGÓCIO — setor e dimensão da empresa
3. SITUAÇÃO ATUAL — já têm website ou ferramentas de automação? Qual o ponto de partida?
4. URGÊNCIA — têm um prazo em mente ou algo que os pressiona?
5. ORÇAMENTO — só perguntar depois de perceberem o valor; perguntar de forma suave ("têm uma ideia do investimento que estão dispostos a fazer?")
6. DECISOR — são eles quem toma a decisão final ou há mais alguém envolvido?
7. NOME e CONTACTO (email ou telefone)
8. Quando tiveres nome E contacto, confirmar que alguém da Re-Evolution irá entrar em contacto brevemente

REGRAS:
- Deteta o idioma em que o utilizador escreve e responde sempre nesse mesmo idioma
- Se não conseguires detetar o idioma, usa português europeu por defeito
- Sê simpático, profissional e conciso (máximo 3-4 frases por resposta)
- Faz UMA pergunta de cada vez — nunca múltiplas questões na mesma mensagem
- Adapta a ordem das perguntas ao ritmo natural da conversa; não sigas a lista como um formulário
- Não inventes informações que não tens
- Se perguntarem sobre agendamento direto, explica que após recolheres os dados a equipa entrará em contacto para marcar

FORMATO DA RESPOSTA:
Responde SEMPRE com um objeto JSON válido. O campo "message" é sempre obrigatório. Os restantes são opcionais e condicionais:

{
  "message": "a tua resposta (usa \\n para quebras de linha)",

  "lead": {
    "name": "nome do cliente",
    "contact": "email ou telefone",
    "business_type": "tipo e setor do negócio",
    "current_situation": "situação atual (website, ferramentas, etc.)",
    "main_need": "principal problema ou necessidade",
    "urgency": "urgência ou prazo mencionado",
    "budget": "orçamento ou indicação de investimento",
    "decision_maker": "sim / não / parcialmente (explicação)",
    "interest": "resumo da conversa em 2-3 frases"
  },

  "leadReady": true,
  "goodbye": true
}

REGRAS DOS CAMPOS OPCIONAIS:
- "lead": incluir assim que tiveres nome E contacto confirmados; atualizar com novos campos à medida que os recolhes; usar "não mencionado" para campos ainda por recolher; "interest" deve ser um resumo da conversa gerado por ti
- "leadReady": true APENAS quando TODOS os campos do lead estiverem confirmados (nenhum com "não mencionado") — nunca antes
- "goodbye": true APENAS quando o cliente se despede (adeus, obrigado, tchau, bye, etc.) — sinaliza o fim da conversa
- Antes de teres nome e contacto, omite completamente o campo "lead"`;

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
        max_tokens: 600,
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

  let parsed: { message: string; lead?: Lead; leadReady?: boolean; goodbye?: boolean };
  try {
    parsed = JSON.parse(rawContent);
  } catch {
    parsed = { message: rawContent || 'Desculpe, ocorreu um erro. Tente novamente.' };
  }

  return NextResponse.json({
    message: parsed.message,
    lead: parsed.lead ?? null,
    leadReady: parsed.leadReady ?? false,
    goodbye: parsed.goodbye ?? false,
  });
}
