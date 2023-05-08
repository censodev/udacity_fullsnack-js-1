import imgprcService from '../../imgprc/imgprc.svc'
import fs from 'fs'

describe('Test image processing service', function () {
  it('resize empty buffer', async function () {
    await expectAsync(
      imgprcService.resize(Buffer.from([]), 'test.jpg', 100, 100)
    ).toBeRejectedWithError()
  })
  it('resize valid image', function () {
    fs.readFile('img/santamonica.jpg', async (_, data) => {
      await expectAsync(
        imgprcService.resize(data, 'test.jpg', 100, 100)
      ).toBeResolved()
    })
  })
})
