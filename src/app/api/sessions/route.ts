// API route for sessions
// Creates ephemeral session token for realtime audio communication

// To test:
// Step 1: npm run dev on one terminal
// Step 2: run the following command on the second terminal
// MAC: curl -X POST http://localhost:3000/api/sessions -H "Content-Type: application/json" -d '{"personaId":"cmogtxfg40001i82owv7d6o7t","scenarioId":"cmogutfjx0008i8a8nbrnzpip"}'
// Windows: Invoke-RestMethod -Uri http://localhost:3000/api/sessions -Method POST -ContentType "application/json" -Body '{"personaId":"cmogtxfg40001i82owv7d6o7t","scenarioId":"cmogutfjx0008i8a8nbrnzpip"}'

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from 'openai'

// initialize Prisma client for database queries
const prisma = new PrismaClient()
// initialize OpenAI client with API key
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

// handler function for POST requests
export async function POST(req: Request){

    // parse incoming request body as JSON
    const body = await req.json()

    // extract persona and scenario IDs from input
    const { personaId, scenarioId } = body

    // validate required Ids received
    if (!personaId || !scenarioId ) {
        return NextResponse.json(
        { error: 'personaId and scenarioId are required' },
        { status: 400 }
        )
    }

    // query database for matching persona id
    const persona = await
    prisma.prospectPersona.findUnique(
        { where: { id:personaId } }
    )

    // return 404 error if persona not found
    if (!persona){
        return NextResponse.json(
            { error: `No persona with id : "${personaId}"`},
            { status: 404}
        )
    }

    // query database for matching scenario id
    const scenario = await
    prisma.scenario.findUnique(
        { where: { id:scenarioId } }
    )

    // return 404 error if scenario not found
    if (!scenario){
        return NextResponse.json(
            { error: `No scenario with id : "${scenarioId}"`},
            { status: 404}
        )
    }

    // Build system prompt with persona and scenario details that instructs AI to roleplay
    const systemPrompt = `You are ${persona.firstName} ${persona.lastName}, an SFU alumni receiving a phone call from a student fundraising representative.

    IDENTITY
    - Graduation year: ${persona.graduationYear}
    - Degree: ${[persona.degree]}
    - Current role: ${persona.currentRole ?? 'not specified'}
    - Location: ${persona.city ?? 'unknown'}, ${persona.province ?? ''}
    - Donor history: ${persona.prospectHistory}

    PERSONALITY
    ${persona.personality}

    BACKSTORY
    ${persona.backstory}

    CALL CONTEXT
    - Scenario: ${scenario.title}
    - Description: ${scenario.description ?? 'No additional context.'}
    - Difficulty level: ${scenario.difficulty}
    - The caller is practicing these skills on this call: ${scenario.focusSkills.join(', ')}

    BEHAVIOR RULES
    - Stay fully in character. Never break the fourth wall. Never say you are an AI. Never mention this is a simulation.
    - This is a live phone call. Speak naturally, conversationally, in 1 to 3 short sentences at a time. Do not lecture, do not list things, do not narrate your own emotions, unless that is a necessity for the personality you are playing.
    - React to the user's approach. If they personalize to your background (degree, year, role, city), warm up. If they're generic or pushy, stay guarded or push back.
    - Surface objections from this list when it feels natural, in roughly this order of likelihood: ${persona.likelyObjections.join('; ')}
    - Topics that genuinely interest you (engage warmly if the rep brings them up): ${persona.triggerTopics.join(', ')}
    - A realistic gift range for you is: ${persona.targetAskRange}. Only accept asks that fall within or below this range, and only after the rep has handled at least one of your objections well.
    - If the call difficulty is ADVANCED, be more resistant: more objections, slower to warm, harder to close. If BEGINNER, be more forgiving. INTERMEDIATE is the default tone described above.
    - The user should hear *you* speak first when the call connects. Open with a brief, in-character "hello" appropriate to your personality (curt, warm, suspicious, whatever fits).`

    // create realtime session with OpenAI for two-way audio conversation
    // uses gpt-4o-realtime-preview model
    const completion = await
    openai.beta.realtime.sessions.create({
        model:'gpt-4o-realtime-preview',
        voice: 'alloy',
        instructions: systemPrompt,
        input_audio_transcription: {model: 'whisper-1'} //enable audio transcription
    })

    // extract ephemeral token from the session response for temporary access
    const ephemeral = completion.client_secret.value
    // generate unique ID to track this session on the client side
    // to do: change this so we can save the session to the database CallSessions.
    const sessionId = crypto.randomUUID()

    // return session details to client to establish connection
    return NextResponse.json({
        sessionId,
        clientSecret: ephemeral,
        model:'gpt-4o-realtime-preview'
    })

}