import { expect } from 'chai'
import { Redis } from 'ioredis'

import { TimeoutOptions } from '../../src/misc'
import Semaphore from '../../src/RedisSemaphore'
import { delay } from '../../src/utils/index'
import client from '../redisClient'

const timeoutOptions: TimeoutOptions = {
  lockTimeout: 100,
  acquireTimeout: 100,
  refreshInterval: 80,
  retryInterval: 10
}

describe('Semaphore', () => {
  it('should fail on invalid arguments', () => {
    expect(() => new Semaphore((null as unknown) as Redis, 'key', 5)).to.throw(
      '"client" is required'
    )
    expect(() => new Semaphore(({} as unknown) as Redis, 'key', 5)).to.throw(
      '"client" must be instance of ioredis client'
    )
    expect(() => new Semaphore(client, '', 5)).to.throw('"key" is required')
    expect(() => new Semaphore(client, (1 as unknown) as string, 5)).to.throw(
      '"key" must be a string'
    )
    expect(() => new Semaphore(client, 'key', 0)).to.throw(
      '"limit" is required'
    )
    expect(
      () => new Semaphore(client, 'key', ('10' as unknown) as number)
    ).to.throw('"limit" must be a number')
  })
  it('should acquire and release semaphore', async () => {
    const semaphore1 = new Semaphore(client, 'key', 2)
    const semaphore2 = new Semaphore(client, 'key', 2)
    const identifier1 = await semaphore1.acquire()
    const identifier2 = await semaphore2.acquire()
    expect(await client.zrange('semaphore:key', 0, -1)).to.have.members([
      identifier1,
      identifier2
    ])
    await semaphore1.release()
    expect(await client.zrange('semaphore:key', 0, -1)).to.be.eql([identifier2])
    await semaphore2.release()
    expect(await client.zcard('semaphore:key')).to.be.eql(0)
  })
  it('should refresh lock every refreshInterval ms until release', async () => {
    const semaphore1 = new Semaphore(client, 'key', 2, timeoutOptions)
    const semaphore2 = new Semaphore(client, 'key', 2, timeoutOptions)
    const identifier1 = await semaphore1.acquire()
    const identifier2 = await semaphore2.acquire()
    await delay(100)
    expect(await client.zrange('semaphore:key', 0, -1)).to.have.members([
      identifier1,
      identifier2
    ])
    await semaphore1.release()
    expect(await client.zrange('semaphore:key', 0, -1)).to.be.eql([identifier2])
    await semaphore2.release()
    expect(await client.zcard('semaphore:key')).to.be.eql(0)
  })
  it('should reject with error if lock is lost between refreshes', async () => {
    const semaphore = new Semaphore(client, 'key', 2, timeoutOptions)
    let lostLockError
    function catchError(err: any) {
      lostLockError = err
    }
    process.on('unhandledRejection', catchError)
    await semaphore.acquire()
    await client.del('semaphore:key')
    await delay(100)
    expect(lostLockError).to.be.ok
    process.removeListener('unhandledRejection', catchError)
  })
  it('should be reusable', async () => {
    const semaphore1 = new Semaphore(client, 'key', 2, timeoutOptions)
    const semaphore2 = new Semaphore(client, 'key', 2, timeoutOptions)

    /* Lifecycle 1 */
    const identifier11 = await semaphore1.acquire()
    const identifier12 = await semaphore2.acquire()
    await delay(100)
    expect(await client.zrange('semaphore:key', 0, -1)).to.have.members([
      identifier11,
      identifier12
    ])
    await semaphore1.release()
    await semaphore2.release()
    expect(await client.zrange('semaphore:key', 0, -1)).to.be.eql([])
    await delay(100)
    expect(await client.zrange('semaphore:key', 0, -1)).to.be.eql([])

    await delay(100)

    /* Lifecycle 2 */
    const identifier21 = await semaphore1.acquire()
    const identifier22 = await semaphore2.acquire()
    await delay(100)
    expect(await client.zrange('semaphore:key', 0, -1)).to.have.members([
      identifier21,
      identifier22
    ])
    await semaphore1.release()
    await semaphore2.release()
    expect(await client.zrange('semaphore:key', 0, -1)).to.be.eql([])
    await delay(100)
    expect(await client.zrange('semaphore:key', 0, -1)).to.be.eql([])

    await delay(100)

    /* Lifecycle 3 */
    const identifier31 = await semaphore1.acquire()
    const identifier32 = await semaphore2.acquire()
    await delay(100)
    expect(await client.zrange('semaphore:key', 0, -1)).to.have.members([
      identifier31,
      identifier32
    ])
    await semaphore1.release()
    await semaphore2.release()
    expect(await client.zrange('semaphore:key', 0, -1)).to.be.eql([])
    await delay(100)
    expect(await client.zrange('semaphore:key', 0, -1)).to.be.eql([])
  })
  it('should throw error on release not acquired semaphore', async () => {
    const semaphore = new Semaphore(client, 'key', 2, timeoutOptions)
    await expect(semaphore.release()).to.eventually.rejectedWith(
      'semaphore key has no identifier'
    )
  })
})
