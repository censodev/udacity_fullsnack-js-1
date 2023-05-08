import imgprcService from '../../imgprc/imgprc.svc'
import fs from 'fs'

describe('Test image processing service', function () {
  it('resize undefined', async function () {
    await expectAsync(imgprcService.resize(undefined)).toBeRejectedWithError()
  })
  it('resize valid image', async function () {
    fs.readFile('img/santamonica.jpg', async (_, data) => {
      await expectAsync(imgprcService.resize(data)).toBeResolved()
    })
  })
})
