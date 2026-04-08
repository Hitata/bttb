import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import readline from 'readline'

const prisma = new PrismaClient()

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

async function main() {
  const username = await prompt('Username: ')
  if (!username) {
    console.error('Username is required')
    process.exit(1)
  }

  const existing = await prisma.adminUser.findUnique({ where: { username } })
  if (existing) {
    console.error(`Admin user "${username}" already exists`)
    process.exit(1)
  }

  const password = await prompt('Password: ')
  if (!password || password.length < 8) {
    console.error('Password must be at least 8 characters')
    process.exit(1)
  }

  const hashed = await bcrypt.hash(password, 12)
  const admin = await prisma.adminUser.create({
    data: { username, password: hashed },
  })

  console.log(`Admin user "${admin.username}" created successfully`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
