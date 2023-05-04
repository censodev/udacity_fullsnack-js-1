import sharp from 'sharp';

const resize = async (inputBuffer: Buffer | undefined, ...wh: number[]): Promise<Buffer> => {
    return sharp(inputBuffer).resize(...wh).toBuffer()
}

export default { resize }