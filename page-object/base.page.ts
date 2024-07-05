import { Page, expect } from '@playwright/test';

export class BasePage {
    constructor(public page: Page) {
        this.page = page;
    }

    private logoHomeButton = this.page.locator('a#nava');
    private homeButton = this.page.locator("li a[href='index.html']");
    private contactButton = this.page.locator("//a[text()='Contact']");
    private cartButton = this.page.locator("//a[text()='Cart']");

    private logInFrameButton = this.page.locator("//a[text()='Log in']");
    private usernameLogInInput = this.page.locator("#loginusername");
    private passwordLogInInput = this.page.locator("#loginpassword");
    private logInButton = this.page.locator("button[onclick='logIn()']");

    private signUpFrameButton = this.page.locator("//a[text()='Sign up']");
    private usernameSignUpInput = this.page.locator("#sign-username");
    private passwordSignUpInput = this.page.locator("#sign-password");
    private signUpButton = this.page.locator("button[onclick='register()']");

    private logOutButton = this.page.locator("#logout2");
    private usernameText = this.page.locator("#nameofuser");

    async clickHomeLogoButton () {
        await this.logoHomeButton.click()
    }

    async clickHomeButton () {
        await this.homeButton.click()
    }

    async clickContactButton () {
        await this.contactButton.click()
    }

    async clickCartButton () {
        await this.cartButton.click()
    }

    async login (username: string, password: string) {
        await this.logInFrameButton.click()
        await this.usernameLogInInput.fill(username);
        await this.passwordLogInInput.fill(password);
        await this.logInButton.click()
        expect(this.usernameText).toBeVisible;
    }

    async signUp (username: string, password: string) {
        await this.signUpFrameButton.click()
        await this.usernameSignUpInput.fill(username);
        await this.passwordSignUpInput.fill(password);
        await this.signUpButton.click()
    }
}