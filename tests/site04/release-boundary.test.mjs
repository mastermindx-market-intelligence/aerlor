import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createServices} from '../../server/services.mjs';
import {checkoutBody,fixture} from '../server-fixtures.mjs';

// These local fixtures confer no commercial approval. Never use real provider keys.
// Unlike the empty-environment baseline, every configuration gate and every
// product/finish price row is otherwise valid: the catalog release flag must stop
// checkout before either a provider request or any transaction-store access.
for(const mode of ['test','live']){
  test(`unreleased production catalog blocks fully configured ${mode} commerce without side effects`,async t=>{
    const productionCatalog=JSON.parse(readFileSync(new URL('../../src/catalog.json',import.meta.url),'utf8'));
    assert.ok(productionCatalog.products.length>0,'The release audit requires a nonempty catalog.');
    for(const product of productionCatalog.products){
      assert.equal(product.released,false,`${product.id} must remain unreleased in this prelaunch audit.`);
      assert.ok(product.finishes.length>0,`${product.id} must have a finish to audit.`);
    }

    const variants=productionCatalog.products.flatMap(product=>product.finishes.map(finish=>({id:product.id,finish})));
    const prices=variants.map((variant,index)=>({
      ...variant,
      priceId:`price_SITE04Fixture${index}`,
      unitAmount:9900,
      currency:'USD',
      maxQuantity:100,
      releaseReference:'SITE04-TEST-FIXTURE-NOT-A-COMMERCIAL-APPROVAL',
      inventoryKey:`stock_site04_fixture_${index}`,
    }));
    const {env}=fixture({
      AERLOR_COMMERCE_MODE:mode,
      STRIPE_SECRET_KEY:`sk_${mode}_site04_fixture_not_a_real_credential`,
      AERLOR_PRICEBOOK_JSON:JSON.stringify(prices),
    });

    const effects={providerCalls:0,storeAccesses:[]};
    const fetcher=()=>{
      effects.providerCalls++;
      throw new Error('SITE04 release audit forbids all provider requests.');
    };
    const store=new Proxy(Object.create(null),{
      get(_target,property){
        effects.storeAccesses.push(String(property));
        throw new Error('SITE04 release audit forbids all transaction-store access.');
      },
    });
    t.after(()=>assert.deepEqual(effects,{providerCalls:0,storeAccesses:[]}));

    // Configuration-only positive control, modified exclusively in memory. If
    // another missing gate disabled commerce, the negative case would be vacuous.
    const releasedFixture=structuredClone(productionCatalog);
    for(const product of releasedFixture.products)product.released=true;
    const positive=createServices({env,productCatalog:releasedFixture,fetcher,store}).config();
    assert.equal(positive.mode,mode);
    assert.equal(positive.checkoutEnabled,true,'The synthetic configuration must otherwise permit checkout.');
    assert.deepEqual(positive.prices,prices.map(({id,finish,unitAmount,currency,maxQuantity})=>({id,finish,unitAmount,currency,maxQuantity})));

    const service=createServices({env,productCatalog:productionCatalog,fetcher,store});
    const config=service.config();
    assert.equal(config.checkoutEnabled,false);
    assert.equal(config.mode,'development');
    assert.deepEqual(config.prices,[],'Unreleased product prices must not become public purchase offers.');
    for(const variant of variants){
      await assert.rejects(
        service.checkout({...checkoutBody(),items:[{...variant,quantity:1}]},'192.0.2.17'),
        {status:503,code:'commerce_unavailable'},
        `${variant.id} / ${variant.finish} must fail at the release boundary.`,
      );
    }
    assert.ok(productionCatalog.products.every(product=>product.released===false),'The production catalog was not mutated by the positive control.');
    assert.deepEqual(effects,{providerCalls:0,storeAccesses:[]});
    t.diagnostic(`${mode}: ${variants.length} product/finish checkout attempts rejected; provider calls=0; transaction-store accesses=0.`);
  });
}
