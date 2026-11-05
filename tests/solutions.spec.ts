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
 await expect(page.locator('h1')).toContainText('Good design belongs');
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
 await expect(page.locator('h1')).toContainText('The ritual extends');
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
 await page.getByRole('button',{name:/Download my project brief/}).click();
 await expect(page.locator('#solutions-brief-error')).toContainText('required');
 await page.locator('[name=market]').selectOption({label:'United States'});
 await page.locator('[name=units]').fill('12');
 await page.locator('[name=locations]').fill('2');
 await page.locator('[name=stage]').selectOption({label:'Exploring options'});
 await page.locator('[name=priority]').selectOption({label:'Styling and handling workflow'});
 await page.locator('[name=category][value=Hairdryers]').check();
 await page.locator('[name=notes]').fill('Check cord routing and shared station ergonomics.');
 const dl=page.waitForEvent('download');
 await page.getByRole('button',{name:/Download my project brief/}).click();
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
 for(const path of ['solutions/','solutions/salons/','solutions/spas/','solutions/fitness/','solutions/residences/','solutions/travel/','solutions/academies/','solutions/studios/','solutions/brief/']){
  await page.goto('./'+path);
  await page.evaluate(async()=>{await document.fonts.ready;});
  const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  const serious=report.violations.filter(x=>x.impact==='critical'||x.impact==='serious');
  expect(serious.map(x=>({id:x.id,description:x.description,nodes:x.nodes.map(n=>n.target)})),path+' '+(isMobile?'mobile':'desktop')).toEqual([]);
 }
});

test('Solutions and business pages never overflow at 320, 390, 768 or 1024 pixels',async({page})=>{
  for(const width of [320,390,768,1024]){
    await page.setViewportSize({width,height:850});
    for(const path of ['solutions/','solutions/salons/','solutions/spas/','solutions/fitness/','solutions/brief/']){
      await page.goto('./'+path);
      await page.evaluate(async()=>{await document.fonts.ready;});
      const geometry=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,view:innerWidth}));
      expect(geometry.scroll,path+' at '+width+'px').toBeLessThanOrEqual(geometry.view+1);
    }
  }
});
test('the live brief preview updates without persisting data or creating a remote submission',async({page})=>{
  const posts:string[]=[];
  page.on('request',req=>{if(req.method()==='POST')posts.push(req.url());});
  await page.goto('./solutions/brief/?industry=spas');
  await expect(page.locator('[data-preview=industry]')).toHaveText('Spas & Wellness');
  await expect(page.locator('[data-preview-questions]')).toContainText('wet-area');
  await page.locator('[name=market]').selectOption({label:'Canada'});
  await page.locator('[name=units]').fill('15');
  await page.locator('[name=locations]').fill('3');
  await page.locator('[name=stage]').selectOption({label:'New opening or build-out'});
  await page.locator('[name=priority]').selectOption({label:'Electrical and site integration'});
  await page.locator('input[name=category][value=Hairdryers]').check();
  await expect(page.locator('[data-preview=units]')).toHaveText('15');
  await expect(page.locator('[data-preview=locations]')).toHaveText('3');
  await expect(page.locator('[data-preview=categories]')).toHaveText('Hairdryers');
  await expect(page.locator('[data-preview=priority]')).toHaveText('Electrical and site integration');
  const download=page.waitForEvent('download');
  await page.getByRole('button',{name:/Download my project brief/}).click();
  const file=await download;
  expect(file.suggestedFilename()).toBe('aerlor-spas-brief.txt');
  expect(posts).toEqual([]);
  expect(await page.evaluate(()=>localStorage.length)).toBe(0);
});

test('all industry visual assets decode, including the original salon SVG, without broken images',async({page})=>{
  for(const path of ['solutions/','solutions/salons/','solutions/spas/','solutions/fitness/','solutions/residences/','solutions/travel/','solutions/academies/','solutions/studios/','solutions/brief/']){
    await page.goto('./'+path);
    const failed=await page.evaluate(async()=>{
      const imgs=[...document.images];
      imgs.forEach(img=>{img.loading='eager';});
      await Promise.all(imgs.map(img=>img.decode().catch(()=>{})));
      return imgs.filter(img=>img.naturalWidth===0).map(img=>img.getAttribute('src'));
    });
    expect(failed,path).toEqual([]);
  }
});
test('the private planner can copy a complete brief without submitting or storing data',async({page})=>{
  await page.addInitScript(()=>{
    Object.defineProperty(navigator,'clipboard',{configurable:true,value:{
      writeText:async(text:string)=>{(window as Window & {__copiedBrief?:string}).__copiedBrief=text;}
    }});
  });
  const posts:string[]=[];
  page.on('request',req=>{if(req.method()==='POST')posts.push(req.url());});
  await page.goto('./solutions/brief/?industry=salons');
  await page.locator('[name=market]').selectOption({label:'United States'});
  await page.locator('[name=units]').fill('8');
  await page.locator('[name=locations]').fill('1');
  await page.locator('[name=stage]').selectOption({label:'Exploring options'});
  await page.locator('[name=priority]').selectOption({label:'Styling and handling workflow'});
  await page.getByRole('button',{name:'Copy brief text'}).click();
  await expect(page.locator('#solutions-brief-error')).toContainText('equipment category');
  await page.locator('[name=category][value=Hairdryers]').check();
  await page.locator('[name=notes]').fill('Review station placement and cord reach.');
  await page.getByRole('button',{name:'Copy brief text'}).click();
  await expect(page.locator('#solutions-brief-feedback')).toContainText('copied');
  const captured=await page.evaluate(()=>(window as Window & {__copiedBrief?:string}).__copiedBrief||'');
  expect(captured).toContain('Styling and handling workflow');
  expect(captured).toContain('Review station placement and cord reach.');
  expect(captured).toContain('Nothing has been transmitted to AERLOR');
  expect(posts).toEqual([]);
  expect(await page.evaluate(()=>localStorage.length)).toBe(0);
});
