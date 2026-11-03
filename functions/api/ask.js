export async function onRequestPost(context) {
    try {
        const { question } = await context.request.json();
        const API_KEY = context.env.GROQ_API_KEY;

        if (!API_KEY) {
            return new Response(JSON.stringify({ answer: "API Key missing in configuration." }), { status: 500 });
        }

        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "You are a helpful, precise Q&A assistant." },
                    { role: "user", content: question }
                ],
                max_tokens: 1000
            })
        });

        const data = await groqResponse.json();
        
        if (data.choices && data.choices.length > 0) {
            const aiReply = data.choices[0].message.content;
            return new Response(JSON.stringify({ answer: aiReply }), {
                headers: { "Content-Type": "application/json" }
            });
        } else {
            return new Response(JSON.stringify({ answer: "Failed to generate answer." }), { status: 500 });
        }

    } catch (err) {
        return new Response(JSON.stringify({ answer: "Server connection failure." }), { status: 500 });
    }
}
