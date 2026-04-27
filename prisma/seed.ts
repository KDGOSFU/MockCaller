import { PrismaClient, ProspectHistory, AskRange} from '@prisma/client'
import prospectData from '../data/prospects.json'

const prisma = new PrismaClient()

async function main() {
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
    console.log("Success")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())