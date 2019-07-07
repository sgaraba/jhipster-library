import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class BorrowedBookComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-borrowed-book div table .btn-danger'));
  title = element.all(by.css('jhi-borrowed-book div h2#page-heading span')).first();

  async clickOnCreateButton(timeout?: number) {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(timeout?: number) {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons() {
    return this.deleteButtons.count();
  }

  async getTitle() {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class BorrowedBookUpdatePage {
  pageTitle = element(by.id('jhi-borrowed-book-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  borrowDateInput = element(by.id('field_borrowDate'));
  bookSelect = element(by.id('field_book'));
  clientSelect = element(by.id('field_client'));

  async getPageTitle() {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setBorrowDateInput(borrowDate) {
    await this.borrowDateInput.sendKeys(borrowDate);
  }

  async getBorrowDateInput() {
    return await this.borrowDateInput.getAttribute('value');
  }

  async bookSelectLastOption(timeout?: number) {
    await this.bookSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async bookSelectOption(option) {
    await this.bookSelect.sendKeys(option);
  }

  getBookSelect(): ElementFinder {
    return this.bookSelect;
  }

  async getBookSelectedOption() {
    return await this.bookSelect.element(by.css('option:checked')).getText();
  }

  async clientSelectLastOption(timeout?: number) {
    await this.clientSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async clientSelectOption(option) {
    await this.clientSelect.sendKeys(option);
  }

  getClientSelect(): ElementFinder {
    return this.clientSelect;
  }

  async getClientSelectedOption() {
    return await this.clientSelect.element(by.css('option:checked')).getText();
  }

  async save(timeout?: number) {
    await this.saveButton.click();
  }

  async cancel(timeout?: number) {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class BorrowedBookDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-borrowedBook-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-borrowedBook'));

  async getDialogTitle() {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
