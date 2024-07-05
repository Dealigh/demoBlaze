import { Page, expect } from '@playwright/test';
import { BasePage } from './Base.page.ts';

export class CartPage extends BasePage {
    constructor(public page: Page) {
        super(page)
    }

    private productsTable = this.page.locator(".table");
    private productsTableHeaders = this.productsTable.locator("thead");
    private tableBodySelector = this.productsTable.locator("#tbodyid");
    private totalPrice = this.page.locator("#totalp");
    private placeOrderButton = this.page.locator("//button[text()='Place Order']")
    //private async cell (row: number, column: number): Promise<string> { return `${this.tableBodySelector} tr:nth-child(${row}) td:nth-child(${column})` };

    async getProductTableHeaders(): Promise<string[]> {
        await expect(this.productsTable).toBeVisible();
        await expect(this.productsTableHeaders).toBeVisible()
        const headersText = await this.productsTableHeaders.allInnerTexts();
        return headersText[0].split('\t').map(header => header.trim());
    }

    async getRowCount(): Promise<number> {
        await expect(this.tableBodySelector).toBeVisible()
        let trs = this.tableBodySelector.locator(`tr`);
        return await trs.count();
    }

    async getCellText(row: number, column: number): Promise<string> {
        return await this.tableBodySelector.locator(`tr:nth-child(${row}) td:nth-child(${column})`).innerText();
    }

    async getProductRow (productName: string): Promise<number> {
        await expect(this.tableBodySelector).toBeVisible()
        let rows = await this.getRowCount ();
        let column = await this.getProductColumn ("Title");
        for(let i = 1; i <= rows; i++) {
            let innerText = await this.getCellText(i, column);
            if (innerText===productName) {
                return i;
            }
        }
        return 0;
    }

    async getProductColumn (columnName: string): Promise<number> {
        await expect(this.tableBodySelector).toBeVisible()
        let columnIndex = (await this.getProductTableHeaders()).indexOf(columnName) + 1;
        return columnIndex;
    }

    async getPriceCount (): Promise<number> {
        let priceColumnIndex = await this.getProductColumn ("Price");
        let rows = await this.getRowCount ();
        let priceSum = 0;
        for(let i = 1; i <= rows; i++) {
            priceSum += Number(await this.getCellText(i, priceColumnIndex));
        }
        return priceSum;
    }

    async deleteProductFromCart (productTitle: string) {
        let deleteColumnIndex = await this.getProductColumn ("x");
        let productRowNumber = await this.getProductRow (productTitle);
        let rows = await this.getRowCount ();
        for(let i = 1; i <= rows; i++) {
            if(i === productRowNumber) {
                await this.tableBodySelector.locator(`tr:nth-child(${i}) td:nth-child(${deleteColumnIndex}) a`).click();
                await this.page.waitForSelector(`//td[text()='${productTitle}']`, { state: 'detached' });
            }
        }
    }

    async getTotalPrice (): Promise<number> {
        let totalPrice = Number(await this.totalPrice.textContent());
        return totalPrice;
    }
}