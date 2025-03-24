import puppeteer from 'puppeteer'
import fs from 'node:fs'

export async function getAnimeTags() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  const orderedTags: string[] = []
  for (let i = 1; i <= 10; i++) {
    await page.goto(`https://bangumi.tv/anime/tag?page=${i}`)
    const tags = await page.evaluate(() => {
      const tags = Array.from(document.querySelectorAll('#tagList a'))
      return tags.map((tag) => tag.textContent!)
    })
    orderedTags.push(...tags)
  }

  await browser.close()

  fs.writeFileSync('tags.json', JSON.stringify(orderedTags, null, 2))
}

getAnimeTags()
