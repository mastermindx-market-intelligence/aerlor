import {test,expect} from '@playwright/test';

const artReady = async (image:import('@playwright/test').Locator) => {
  await image.scrollIntoViewIfNeeded();
  await expect.poll(()=>image.evaluate(el => {
    const img=el as HTMLImageElement;
    return img.complete && img.naturalWidth>0;
  }),{timeout:15000}).toBe(true);
};

test('campaign photography loads on the homepage without duplicate headings or overflow',async({page})=>{
  await page.goto('./',{waitUntil:'domcontentloaded'});
  await expect(page.locator('.campaign-intro h1')).toHaveCount(1);
  await expect(page.locator('main h1')).toHaveCount(1);
  await artReady(page.locator('.campaign-intro-image'));
  await artReady(page.locator('.campaign-story-main img'));
  for(const image of await page.locator('.campaign-engineering-grid img').all()){
    await artReady(image);
  }
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  await expect(page.locator('.campaign-disclaimer')).toContainText('COLLECTION IN DEVELOPMENT');
});

test('premium product imagery is finish-aware and explicitly a concept',async({page})=>{
  await page.goto('./products/hairdryer-premium/',{waitUntil:'domcontentloaded'});
  const hero=page.locator('[data-gallery-image]');
  await artReady(hero);
  await expect(hero).toHaveAttribute('src',/campaign\/studio-detail\.webp$/);
  await expect(page.locator('.product-photo-story figure')).toHaveCount(5);
  await expect(page.locator('.product-photo-story')).toContainText('concept');
  await page.locator('[data-product-finish]').selectOption('Graphite');
  await expect(hero).toHaveAttribute('src',/campaign\/travel-case\.webp$/);
  await artReady(hero);
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
