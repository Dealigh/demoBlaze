import { chromium } from 'playwright';
import { test, expect, type Page, defineConfig } from '@playwright/test';
import { HomePage } from "../page-object/home.page";
import Env from '../utils/environment';

export default defineConfig({
    use: {
        video: {
            mode: 'on-first-retry',
            size: {
                width: 640,
                height: 480
            }
        }
    }
});

test.describe ('Log In scenarios', () => {
    let page: Page;
    let homePage: HomePage;

    test.beforeAll("Navigate to DemoBlaze", async () => {
        let browser = await chromium.launch();
        let context = await browser.newContext({});
        page = await context.newPage ();
        await page.goto(Env.URL);

        homePage = new HomePage(page);
    })

    test('Should Login in with an existing username and password', async () => {
        await homePage.login (Env.USERNAME, Env.PASSWORD);
    })

    test('Should not login when the password is incorrect', async () => {
        await homePage.login (Env.USERNAME, "wrongPassword");
        await homePage.page.on("dialog", (dialog) => {
            expect(dialog.message()).toBe("Wrong password")
        })
    })
})