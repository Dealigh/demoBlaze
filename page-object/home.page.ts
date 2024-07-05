import { Page } from '@playwright/test';
import { BasePage } from './Base.page.ts';

export class HomePage extends BasePage{
    constructor(public page: Page) {
        super(page)
    }

    private phoneCategoryButton = this.page.locator("//*[text()='Phones']");
    private notebookCategoryButton = this.page.locator("//*[text()='Laptops']");
    private monitorCategoryButton = this.page.locator("//*[text()='Monitors']");
    private cardProductName;

    async clickPhoneCategoryButton () {
        await this.phoneCategoryButton.click();
    }

    async clickNotebookCategoryButton () {
        await this.notebookCategoryButton.click();
    }

    async clickMonitorCategoryButton () {
        await this.monitorCategoryButton.click();
    }

    async clickProductCardTitle (name: string) {
        this.cardProductName = this.page.locator(`//a[text()='${name}']`)
        await this.cardProductName.click();
    }
}