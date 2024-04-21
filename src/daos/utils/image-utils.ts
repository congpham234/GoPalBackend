import axios from 'axios';
import fs from 'fs';
import sharp from 'sharp';

export async function imageUrlToReadStream(imgUrl: string): Promise<fs.ReadStream> {
  // Generate a temporary file name, could be enhanced with a unique identifier
  const tempFilePath = `tempfile-${Date.now()}.png`;

  // Use a Promise to handle the async file operations
  await fs.promises.writeFile(tempFilePath, await imageUrlToBuffer(imgUrl));

  // Return a ReadStream of the temporary file
  return fs.createReadStream(tempFilePath);
}

export async function imageUrlToBuffer(imgUrl: string): Promise<Buffer> {
  // Fetch the image as an ArrayBuffer
  const response = await axios.get(imgUrl, { responseType: 'arraybuffer' });
  return Buffer.from(response.data);
}

/**
 * Fetches an image from a URL and creates a fully transparent version of the same dimensions.
 *
 * @param imgUrl The URL of the image to fetch and process.
 * @returns A Promise that resolves with a ReadStream of the transparent image.
 */
export async function createTransparentMaskFromUrl(imgUrl: string): Promise<fs.ReadStream> {
  // Fetch the image as a Buffer
  const imageBuffer = await imageUrlToBuffer(imgUrl);

  // Get dimensions of the image
  const metadata = await sharp(imageBuffer).metadata();

  // Ensure metadata width and height are defined
  if (!metadata.width || !metadata.height) {
    throw new Error('Image metadata is missing dimensions.');
  }

  // Create a fully transparent buffer (all alpha values set to 0)
  const transparentBuffer: Buffer = Buffer.alloc(metadata.width * metadata.height * 4);
  for (let i = 3; i < transparentBuffer.length; i += 4) {
    transparentBuffer[i] = 0; // Set only the alpha values to 0 (fully transparent)
  }

  // Create a sharp instance with the original image dimensions but using the transparent buffer
  const buffer = await sharp({
    create: {
      width: metadata.width,
      height: metadata.height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{
      input: transparentBuffer,
      raw: { width: metadata.width, height: metadata.height, channels: 4 },
    }])
    .png()
    .toBuffer();

  // Temporary file path
  const tempFilePath = `tempfile-${Date.now()}.png`;

  // Save the processed image to a temporary file
  await sharp(buffer).toFile(tempFilePath);

  // Return a ReadStream of the temporary file
  return fs.createReadStream(tempFilePath);
}
