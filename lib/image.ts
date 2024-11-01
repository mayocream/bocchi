export const convertToWebp = async (image: File | Blob, quality: number) => {
  const bitmap = await createImageBitmap(image)
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)

  const context = canvas.getContext('2d')!

  context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height)
  return await canvas.convertToBlob({ type: 'image/webp', quality })
}
