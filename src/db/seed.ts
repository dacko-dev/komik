import { db } from '@/db'
import { languages } from '@/db/schema'

async function seed() {
    db.insert(languages)
        .values([
            {
                code: 'en',
                flag: '🇬🇧',
                name: 'English',
                isRTL: false,
            },
        ])
        .onConflictDoNothing()
}

async function main() {
    try {
        await seed()
    } catch (error) {
        console.error('Error seeding the database', error)
        process.exit(1)
    }
}

main()
