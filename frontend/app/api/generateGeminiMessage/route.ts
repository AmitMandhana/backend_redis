import { NextResponse } from "next/server";


const createPrompt = (name: string, sanitizedRule: string) => {
    return   `You are a CRM assistant helping to write personalized promotional messages for users. Based on the campaign details below, generate a short, friendly marketing message for each user. The message should include the user's name (placeholder as {name}) and feel personal but concise.

    ### Campaign Details:
    - Campaign Name: ${name}
    - Segment Rules: ${sanitizedRule}
    
    ### Message Style:
    - Friendly and informal tone
    - 1-2 sentences
    - Include a benefit or incentive (e.g., discount, special offer)
    - Keep it personalized with the user’s name (e.g., "Hi {name}, …")
    
    ### Example:
    If the campaign name is "Loyalty Booster" and segment rule is "spend > 1000 AND visits < 20", the output could be:
    "Hi {name}, thanks for being awesome! Here's 10% off your next order just for you."
    
    ### OUTPUT style:
    just the message, no other text. Do not include any other information or context.
    ### Example:
    "Hi {name}, thanks for being awesome! Here's 10% off your next order just for you."

    ### Now generate a message:
    `
}

export async function POST(req : Request){
  try{
    const {name, rule} = await req.json();
    const prompt = createPrompt(name, rule);
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if (process.env.GEMINI_API) {
        headers.append("X-goog-api-key", process.env.GEMINI_API);
    }
    
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
        method: "POST",
        headers,
        body : JSON.stringify({
            contents : [
                {
                    parts : [
                        {
                            text : prompt,
                        }
                    ]
                }
            ]
        })
    })
    const data = await response.json();
    const sanitizedData = data.candidates[0].content.parts[0].text;
    console.log("Gemini response:", sanitizedData);
    return NextResponse.json({
        success: true,
        message: sanitizedData,

    })
  }catch(e){
    console.error(e);
    return NextResponse.json({
        success: false,
        error: "Failed to generate message",
        
    })
  }
    
}