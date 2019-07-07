import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class BookComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-book div table .btn-danger'));
  title = element.all(by.css('jhi-book div h2#page-heading span')).first();

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

export class BookUpdatePage {
  pageTitle = element(by.id('jhi-book-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  isbnInput = element(by.id('field_isbn'));
  nameInput = element(by.id('field_name'));
  publishYearInput = element(by.id('field_publishYear'));
  copiesInput = element(by.id('field_copies'));
  coverInput = element(by.id('file_cover'));
  publisherSelect = element(by.id('field_publisher'));
  authorSelect = element(by.id('field_author'));

  async getPageTitle() {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIsbnInput(isbn) {
    await this.isbnInput.sendKeys(isbn);
  }

  async getIsbnInput() {
    return await this.isbnInput.getAttribute('value');
  }

  async setNameInput(name) {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput() {
    return await this.nameInput.getAttribute('value');
  }

  async setPublishYearInput(publishYear) {
    await this.publishYearInput.sendKeys(publishYear);
  }

  async getPublishYearInput() {
    return await this.publishYearInput.getAttribute('value');
  }

  async setCopiesInput(copies) {
    await this.copiesInput.sendKeys(copies);
  }

  async getCopiesInput() {
    return await this.copiesInput.getAttribute('value');
  }

  async setCoverInput(cover) {
    await this.coverInput.sendKeys(cover);
  }

  async getCoverInput() {
    return await this.coverInput.getAttribute('value');
  }

  async publisherSelectLastOption(timeout?: number) {
    await this.publisherSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async publisherSelectOption(option) {
    await this.publisherSelect.sendKeys(option);
  }

  getPublisherSelect(): ElementFinder {
    return this.publisherSelect;
  }

  async getPublisherSelectedOption() {
    return await this.publisherSelect.element(by.css('option:checked')).getText();
  }

  async authorSelectLastOption(timeout?: number) {
    await this.authorSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async authorSelectOption(option) {
    await this.authorSelect.sendKeys(option);
  }

  getAuthorSelect(): ElementFinder {
    return this.authorSelect;
  }

  async getAuthorSelectedOption() {
    return await this.authorSelect.element(by.css('option:checked')).getText();
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

export class BookDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-book-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-book'));

  async getDialogTitle() {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
