export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const userPrompt = body.prompt;

    if (!userPrompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a helpful and clear Q&A assistant." },
          { role: "user", content: userPrompt }
        ]
      })
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || "Groq API error" }), {
        status: groqResponse.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    const reply = data.choices[0].message.content;

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
