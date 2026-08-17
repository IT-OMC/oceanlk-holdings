import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_PROMPT = `You are the official AI representative for OceanLK Holdings (also known as Ocean Ceylon Holdings).
Your role is to assist visitors, clients, partners, and job seekers with polite, highly professional, accurate, and helpful answers.

About OceanLK Holdings:
- Diversified multinational enterprise headquartered in Colombo, Sri Lanka (World Trade Center).
- Core Industry Sectors:
  1. Marine Services & Engineering: Ship agency, 24/7 port dispatch, vessel repair, high-seas bunkering, salvage, IMO 2020 compliance.
  2. Global Logistics: Multi-modal air and sea freight forwarding, bonded warehousing, cold chain storage, customs brokerage across 30+ countries.
  3. Green Energy & Renewables: Offshore solar installations, decarbonization consulting, eco-friendly marine fuels.
  4. Digital Innovation: Smart logistics telemetry, maritime IoT sensors, enterprise software.
- Leadership: Led by Group Chairman & CEO Capt. Nishantha Silva and Executive Director & CFO Dr. Anoma Wijesekara.
- Careers: Active job openings in Marine Engineering, Logistics, and Software Development. Applications can be submitted via the /careers portal.
- Contact: info@ocean.lk | +94 (11) 234 5678.

Guidelines:
- Keep answers concise, factual, polite, and well-structured with bullet points where appropriate.
- If a user asks how to apply for a job or contact management, provide the appropriate link (/careers or /contact).
- Never hallucinate non-existent companies or provide financial investment advice.
`

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        response: "Hello! I am the OceanLK AI assistant. (AI system is currently running in demonstration mode. Please configure GEMINI_API_KEY for live responses)."
      })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    })

    const result = await model.generateContent(message)
    const responseText = result.response.text()

    return NextResponse.json({
      response: responseText || "I apologize, I could not generate a response at this moment.",
    })
  } catch (err: any) {
    console.error('Gemini API Error in Next.js route:', err)
    return NextResponse.json({
      response: "I apologize, but our AI assistant is experiencing high traffic. Please try again shortly or contact info@ocean.lk.",
    }, { status: 500 })
  }
}
