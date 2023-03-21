import { PrismaClient } from '@prisma/client'

describe('example test with Prisma Client', () => {
  let prisma = new PrismaClient()

  beforeAll(async () => {
    await prisma.$connect()
  })
  afterAll(async () => {
    await prisma.$disconnect()
  })
  test('Test query Users', async () => {
    const data = await prisma.usuarios.findMany({ take: 1, select: { id: true } })
    expect(data).toBeTruthy()
  })
  test('Test query Municipios', async () => {
    const data = await prisma.municipios.findMany({ take: 1  })
    expect(data).toBeTruthy()
  })

  test('Test query Sucursales', async () => {
    const data = await prisma.sucursales.findMany({ take: 1  })
    expect(data).toBeTruthy()
  })
})