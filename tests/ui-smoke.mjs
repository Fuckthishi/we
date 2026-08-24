import { chromium } from 'playwright';

const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const errors=[];
page.on('pageerror',e=>errors.push(String(e)));
await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
await page.waitForSelector('.product-card');
await page.locator('.product-card').first().tap();
await page.waitForSelector('#productModal[open]');

const color=page.locator('.color-section');
const size=page.locator('.size-section');
if(await color.count()!==1||await size.count()!==1)throw new Error('Missing color or size section');
const colorBox=await color.boundingBox(),sizeBox=await size.boundingBox();
if(!colorBox||!sizeBox||colorBox.y>=sizeBox.y)throw new Error('Color must appear before size on mobile');

const colors=page.locator('.color-btn');
if(await colors.count()>1){await colors.nth(1).tap();await page.waitForTimeout(100);}
await page.locator('.size-choice').first().tap();
const hint=await page.locator('#sizeHint').textContent();
if(!hint?.includes('selected'))throw new Error('Size selection did not register');

const before=await page.locator('#galleryCounter').textContent();
await page.locator('#galleryNext').tap();
await page.waitForTimeout(100);
const after=await page.locator('#galleryCounter').textContent();
if(before===after)throw new Error('Gallery next control did not change photo');

await page.locator('#addToBag').tap();
await page.waitForSelector('#cartDrawer.open');
if((await page.locator('#cartCount').textContent())==='0')throw new Error('Cart count did not update');
if(errors.length)throw new Error(`Page errors: ${errors.join(' | ')}`);

await browser.close();
console.log('UI smoke test passed');
