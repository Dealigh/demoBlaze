import { Page } from '@playwright/test';
import { BasePage } from './Base.page.ts';

export class ProductPage extends BasePage{
    constructor(public page: Page) {
        super(page);

        this.page.on("dialog", (dialog) => {
            dialog.accept();
        })
    }

    private titleName = this.page.locator("h2.name");
    private priceText = this.page.locator("h3.price-container");
    private addToCartButton = this.page.locator("//a[text()='Add to cart']");

    async getTitleName (): Promise<string> {
        const title = await this.titleName.textContent();
        return title ? title.trim (): '';
    }

    async getPriceText (): Promise<number> {
        let priceText = await this.priceText.textContent();
        let price;
        priceText ? price = priceText.replace(/\D/g, ''): price = 0;
        return Number(price.trim());
    }

    async clickAddToCartButton () {
        await this.addToCartButton.click();
    }
}