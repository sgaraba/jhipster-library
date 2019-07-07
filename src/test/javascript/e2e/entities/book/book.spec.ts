/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { BookComponentsPage, BookDeleteDialog, BookUpdatePage } from './book.page-object';
import * as path from 'path';

const expect = chai.expect;

describe('Book e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let bookUpdatePage: BookUpdatePage;
  let bookComponentsPage: BookComponentsPage;
  let bookDeleteDialog: BookDeleteDialog;
  const fileNameToUpload = 'logo-jhipster.png';
  const fileToUpload = '../../../../../../src/main/webapp/content/images/' + fileNameToUpload;
  const absolutePath = path.resolve(__dirname, fileToUpload);

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Books', async () => {
    await navBarPage.goToEntity('book');
    bookComponentsPage = new BookComponentsPage();
    await browser.wait(ec.visibilityOf(bookComponentsPage.title), 5000);
    expect(await bookComponentsPage.getTitle()).to.eq('libraryApp.book.home.title');
  });

  it('should load create Book page', async () => {
    await bookComponentsPage.clickOnCreateButton();
    bookUpdatePage = new BookUpdatePage();
    expect(await bookUpdatePage.getPageTitle()).to.eq('libraryApp.book.home.createOrEditLabel');
    await bookUpdatePage.cancel();
  });

  it('should create and save Books', async () => {
    const nbButtonsBeforeCreate = await bookComponentsPage.countDeleteButtons();

    await bookComponentsPage.clickOnCreateButton();
    await promise.all([
      bookUpdatePage.setIsbnInput('isbn'),
      bookUpdatePage.setNameInput('name'),
      bookUpdatePage.setPublishYearInput('publishYear'),
      bookUpdatePage.setCopiesInput('5'),
      bookUpdatePage.setCoverInput(absolutePath),
      bookUpdatePage.publisherSelectLastOption()
      // bookUpdatePage.authorSelectLastOption(),
    ]);
    expect(await bookUpdatePage.getIsbnInput()).to.eq('isbn', 'Expected Isbn value to be equals to isbn');
    expect(await bookUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    expect(await bookUpdatePage.getPublishYearInput()).to.eq('publishYear', 'Expected PublishYear value to be equals to publishYear');
    expect(await bookUpdatePage.getCopiesInput()).to.eq('5', 'Expected copies value to be equals to 5');
    expect(await bookUpdatePage.getCoverInput()).to.endsWith(fileNameToUpload, 'Expected Cover value to be end with ' + fileNameToUpload);
    await bookUpdatePage.save();
    expect(await bookUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await bookComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Book', async () => {
    const nbButtonsBeforeDelete = await bookComponentsPage.countDeleteButtons();
    await bookComponentsPage.clickOnLastDeleteButton();

    bookDeleteDialog = new BookDeleteDialog();
    expect(await bookDeleteDialog.getDialogTitle()).to.eq('libraryApp.book.delete.question');
    await bookDeleteDialog.clickOnConfirmButton();

    expect(await bookComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
