import {defineConfig,devices} from '@playwright/test';
// Optional Safari-engine regression run. Install the pinned WebKit build with Playwright first.
export default defineConfig({
 testDir:'./tests',testMatch:'**/*.spec.ts',timeout:45000,fullyParallel:false,workers:2,retries:process.env.CI?1:0,
 reporter:[['list'],['html',{open:'never',outputFolder:'playwright-report/webkit'}]],outputDir:'test-results/webkit',
 use:{baseURL:process.env.TEST_URL||'http://127.0.0.1:4188/aerlor/',trace:'retain-on-failure',screenshot:'only-on-failure'},
 projects:[{name:'desktop',use:{...devices['Desktop Safari'],viewport:{width:1440,height:1000}}},{name:'mobile',use:{...devices['iPhone 13']}}],
 webServer:process.env.TEST_URL?undefined:{command:'npm run preview',url:'http://127.0.0.1:4188/aerlor/',reuseExistingServer:!process.env.CI,timeout:30000}
});
