import { chromium } from 'playwright';
import { test, expect, type Page, defineConfig } from '@playwright/test';
import { HomePage } from "../page-object/home.page";
import { ProductPage } from "../page-object/product.page";
import { CartPage } from "../page-object/cart.page";
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

type ProductInfo = {
    name: string;
    price?: number;
}

test.describe('Add products to cart scenarios', () => {
    let page: Page;
    let homePage: HomePage;
    let productPage: ProductPage;
    let cartPage: CartPage;

    test.beforeAll("Navigate to DemoBlaze", async () => {
        let browser = await chromium.launch();
        let context = await browser.newContext({});
        page = await context.newPage();
        await page.goto(Env.URL);

        homePage = new HomePage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);
    })

    test("Should add products to cart with correct prices", async () => {
        let productsInfo: ProductInfo[] = [
            { name: "Samsung galaxy s6" },
            { name: "Iphone 6 32gb" },
            { name: "Sony xperia z5" }
        ]

        for (let i = 0; i < productsInfo.length; i++) {
            await homePage.clickPhoneCategoryButton();
            await homePage.clickProductCardTitle(productsInfo[i].name);

            await expect(await productPage.getTitleName()).toBe(productsInfo[i].name);
            productsInfo[i].price = await productPage.getPriceText();
            await productPage.clickAddToCartButton();
            await productPage.clickHomeButton();
        } 
        homePage.clickCartButton();
        //Assert that prices in table and in the product individual page are the same as in cart
        expect(await cartPage.getPriceCount ()).toBe(sumPriceProducts(productsInfo));
        expect(await cartPage.getTotalPrice ()).toBe(sumPriceProducts(productsInfo));
        expect(await cartPage.getRowCount()).toBe(productsInfo.length);
        let productToRemove = "Sony xperia z5";
        await cartPage.deleteProductFromCart (productToRemove);
        const updatedProducts: ProductInfo[] = productsInfo.filter(product => product.name !== productToRemove);
        //assert that the deleted product has been deleted and total price update
        expect(await cartPage.getRowCount()).toBe(updatedProducts.length);
        expect(await cartPage.getPriceCount ()).toBe(sumPriceProducts(updatedProducts));
        expect(await cartPage.getTotalPrice ()).toBe(sumPriceProducts(updatedProducts));
    })

    test.skip("Buy Product", async () => {
        let productInfo: ProductInfo = { name: "Samsung galaxy s6" }
    })

})

function sumPriceProducts (products: ProductInfo[]) {
    let prices = products.reduce((sum, product) => {
        return sum + (product.price || 0);
    }, 0);
    return prices;
}