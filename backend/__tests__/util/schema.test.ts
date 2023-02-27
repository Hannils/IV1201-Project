import * as schemas from '../../src/util/schemas'

describe('Schema tests', () => {
  test('Username schema', () => {
    const res1 = schemas.usernameSchema.safeParse('a')
    const res2 = schemas.usernameSchema.safeParse('abc123')
    const res3 = schemas.usernameSchema.safeParse(new Array(256).fill('a').join(''))
    expect(res1.success).toBe(false)
    expect(res2.success).toBe(true)
    expect(res3.success).toBe(false)
  })

  test('Firstname schema', () => {
    const res1 = schemas.firstnameSchema.safeParse('abc')
    const res2 = schemas.firstnameSchema.safeParse(new Array(256).fill('a').join(''))
    expect(res1.success).toBe(true)
    expect(res2.success).toBe(false)
  })

  test('Lastname schema', () => {
    const res1 = schemas.lastnameSchema.safeParse('abc')
    const res2 = schemas.lastnameSchema.safeParse(new Array(256).fill('a').join(''))
    expect(res1.success).toBe(true)
    expect(res2.success).toBe(false)
  })

  test('Email schema', () => {
    const res1 = schemas.emailSchema.safeParse('abc')
    const res2 = schemas.emailSchema.safeParse('abc.se')
    const res3 = schemas.emailSchema.safeParse('test@abc.se')
    const res4 = schemas.emailSchema.safeParse('test.tester@abc.se')
    const res5 = schemas.emailSchema.safeParse('test.tester@abc.q')
    expect(res1.success).toBe(false)
    expect(res2.success).toBe(false)
    expect(res3.success).toBe(true)
    expect(res4.success).toBe(true)
    expect(res5.success).toBe(false)
  })

  test('Personnumber schema', () => {
    const res1 = schemas.personNumberSchema.safeParse('20010101-1234')
    const res2 = schemas.personNumberSchema.safeParse('2000101-1234')
    const res3 = schemas.personNumberSchema.safeParse('20010101-123')
    const res4 = schemas.personNumberSchema.safeParse('010101-1235')
    expect(res1.success).toBe(true)
    expect(res2.success).toBe(false)
    expect(res3.success).toBe(false)
    expect(res4.success).toBe(false)
  })

  test('Password schema', () => {
    const res1 = schemas.passwordSchema.safeParse('abc')
    const res2 = schemas.passwordSchema.safeParse('abcdef')
    const res3 = schemas.passwordSchema.safeParse(new Array(256).fill('a').join(''))
    expect(res1.success).toBe(false)
    expect(res2.success).toBe(true)
    expect(res3.success).toBe(false)
  })

  test('Years of experience schema', () => {
    const res1 = schemas.yearsOfExperienceSchema.safeParse(-1)
    const res2 = schemas.yearsOfExperienceSchema.safeParse(1)
    const res3 = schemas.yearsOfExperienceSchema.safeParse(1.5)
    const res4 = schemas.yearsOfExperienceSchema.safeParse(250)
    expect(res1.success).toBe(false)
    expect(res2.success).toBe(true)
    expect(res3.success).toBe(true)
    expect(res4.success).toBe(false)
  })
})
