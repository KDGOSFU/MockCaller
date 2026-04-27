import { PrismaClient, ProspectHistory, AskRange, Difficulty} from '@prisma/client'
import prospectData from '../public/data/prospects.json'
import scenariosData from '../public/data/scenarios.json'

const prisma = new PrismaClient()

async function seedPersonas() {

    //Prospect Personas
    console.log('Seeding prospect personas to database...')

    for (const p of prospectData) {
        const data = {
            // Persona Identity
            lastName: p.lastName,
            firstName: p.firstName,
            age: p.age,
            graduationYear: p.graduationYear,
            degree: p.degree,
            currentRole: p.currentRole,
            address1: p.address1,
            address2: p.address2,
            city: p.city,
            province: p.province,
            postalcode: p.postalcode,
            email: p.email,

            // AI Actor Control parameters 
            personality: p.personality,
            backstory: p.backstory,
            prospectHistory: p.prospectHistory as ProspectHistory,
            likelyObjections : p.likelyObjections,
            triggerTopics: p.triggerTopics,
            targetAskRange: p.targetAskRange as AskRange,

            // Json Snapshot
            personaJson: p.personaJson,
        }

        await prisma.prospectPersona.upsert({
            where: {externalId: p.externalId},
            update: data,
            create: {externalId : p.externalId, ...data },
        })

        console.log(`Seed: ${p.firstName} ${p.lastName}`)
    }

    console.log("Prospect Personas Success")
}

async function seedScenarios() {

    //Scenarios
    console.log('Seeding scenarios to database...')

    for (const s of scenariosData) {
        const scenario = await prisma.scenario.upsert({
        where: { title: s.title },
        update: {
            description: s.description,
            difficulty: s.difficulty as Difficulty,
            focusSkills: s.focusSkills,
        },
        create: {
            title: s.title,
            description: s.description,
            difficulty: s.difficulty as Difficulty,
            focusSkills: s.focusSkills,
        },
        })

        // Wipe and rebuild junction rows for this scenario.
        await prisma.scenarioPersona.deleteMany({
        where: { scenarioId: scenario.id },
        })

        for (const externalId of s.personaExternalIds) {
        const persona = await prisma.prospectPersona.findUnique({
            where: { externalId },
        })

        if (!persona) {
            console.warn(`Persona '${externalId}' not found, skipping`)
            continue
        }

        await prisma.scenarioPersona.create({
            data: {
            scenarioId: scenario.id,
            personaId: persona.id,
            },
        })
    }

    console.log(`Seed ${s.title}: (${s.personaExternalIds.length} personas)`)
  }
}

async function main() {
  await seedPersonas()
  await seedScenarios()
  console.log('Done.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())