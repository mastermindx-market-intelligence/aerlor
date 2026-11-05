import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test.beforeEach(async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.route('**/api/config',route=>route.fulfill({json:{checkoutEnabled:false,inquiryEnabled:false,mode:'development',contactEmail:null,turnstileSiteKey:null,prices:[]}}));
});
test('desktop Solutions menu routes through eight industries with keyboard escape',async({page,isMobile})=>{
 test.skip(isMobile);
 await page.goto('./solutions/');
 const summary=page.locator('.solutions-disclosure summary');
 await summary.click();
 await expect(page.locator('.solutions-mega')).toBeVisible();
 await expect(page.locator('.solutions-mega-core a')).toHaveCount(4);
 await expect(page.locator('.solutions-mega-special a')).toHaveCount(4);
 await expect(page.locator('.solutions-mega a[href$="/solutions/salons/"]')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.locator('.solutions-disclosure')).not.toHaveAttribute('open','');
 await summary.click();
 await page.locator('.solutions-mega a[href$="/solutions/salons/"]').click();
 await expect(page.locator('h1')).toContainText('A better standard');
 await expect(page).toHaveURL(/\/solutions\/salons\/$/);
});
test('mobile Solutions disclosure works within the main menu and links to a sector',async({page,isMobile})=>{
 test.skip(!isMobile);
 await page.goto('./');
 await page.getByRole('button',{name:'Open menu'}).click();
 const group=page.locator('.mobile-solutions');
 await group.locator('summary').click();
 await expect(group.locator('a[href$="/solutions/salons/"]')).toBeVisible();
 await group.locator('a[href$="/solutions/spas/"]').click();
 await expect(page.locator('h1')).toContainText('Create room');
 await expect(page.locator('.mobile-menu')).toBeHidden();
});
test('eight sector pages are distinct, responsive and retain preproduction status',async({page})=>{
 for(const sector of ['salons','spas','fitness','residences','travel','academies','studios']){
  await page.goto('./solutions/'+sector+'/');
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('.sol-pillars article')).toHaveCount(3);
  await expect(page.locator('.sol-engineering li')).toHaveCount(3);
  await expect(page.locator('.sol-sector-hero-visual')).toContainText('Preproduction');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),sector).toBe(true);
 }
});
test('project planner preselects industry and downloads locally without posting or persisting data',async({page})=>{
 const posts:string[]=[];
 page.on('request',request=>{if(request.method()==='POST')posts.push(request.url());});
 await page.goto('./solutions/brief/?industry=salons');
 await expect(page.locator('[name=industry]')).toHaveValue('salons');
 await page.getByRole('button',{name:/Download my business brief/}).click();
 await expect(page.locator('#solutions-brief-error')).toContainText('required');
 await page.locator('[name=market]').selectOption({label:'United States'});
 await page.locator('[name=units]').fill('12');
 await page.locator('[name=locations]').fill('2');
 await page.locator('[name=stage]').selectOption({label:'Exploring options'});
 await page.locator('[name=category][value=Hairdryers]').check();
 await page.locator('[name=notes]').fill('Check cord routing and shared station ergonomics.');
 const dl=page.waitForEvent('download');
 await page.getByRole('button',{name:/Download my business brief/}).click();
 const file=await dl;
 expect(file.suggestedFilename()).toBe('aerlor-salons-brief.txt');
 await expect(page.locator('#solutions-brief-feedback')).toContainText('Nothing has been sent');
 expect(posts).toEqual([]);
 expect(await page.evaluate(()=>localStorage.length)).toBe(0);
});
test('business pages and menu meet accessible semantics for key links',async({page,isMobile})=>{
 await page.goto('./solutions/');
 if(isMobile){await page.getByRole('button',{name:'Open menu'}).click();await expect(page.getByRole('navigation',{name:'Mobile navigation'})).toBeVisible();await page.getByRole('button',{name:'Close menu'}).click();}
 else await expect(page.getByRole('navigation',{name:'Main navigation'})).toBeVisible();
 await expect(page.locator('main h1')).toHaveCount(1);
 await expect(page.getByRole('link',{name:/Hotels & Resorts/}).first()).toHaveAttribute('href',/hospitality/);
 await expect(page.getByRole('link',{name:/Salons & Stylists/}).first()).toHaveAttribute('href',/solutions\/salons/);
 await page.goto('./solutions/brief/');
 await expect(page.getByRole('combobox',{name:'Business environment'})).toBeVisible();
 await expect(page.getByRole('spinbutton',{name:'Estimated units or stations'})).toBeVisible();
});

test('solutions, salon and brief screens pass serious WCAG accessibility checks',async({page,isMobile})=>{
 for(const path of ['solutions/','solutions/salons/','solutions/brief/']){
  await page.goto('./'+path);
  await page.evaluate(async()=>{await document.fonts.ready;});
  const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  const serious=report.violations.filter(x=>x.impact==='critical'||x.impact==='serious');
  expect(serious.map(x=>({id:x.id,description:x.description,nodes:x.nodes.map(n=>n.target)})),path+' '+(isMobile?'mobile':'desktop')).toEqual([]);
 }
});
