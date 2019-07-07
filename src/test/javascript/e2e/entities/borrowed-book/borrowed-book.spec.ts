/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { BorrowedBookComponentsPage, BorrowedBookDeleteDialog, BorrowedBookUpdatePage } from './borrowed-book.page-object';

const expect = chai.expect;

describe('BorrowedBook e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let borrowedBookUpdatePage: BorrowedBookUpdatePage;
  let borrowedBookComponentsPage: BorrowedBookComponentsPage;
  let borrowedBookDeleteDialog: BorrowedBookDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load BorrowedBooks', async () => {
    await navBarPage.goToEntity('borrowed-book');
    borrowedBookComponentsPage = new BorrowedBookComponentsPage();
    await browser.wait(ec.visibilityOf(borrowedBookComponentsPage.title), 5000);
    expect(await borrowedBookComponentsPage.getTitle()).to.eq('libraryApp.borrowedBook.home.title');
  });

  it('should load create BorrowedBook page', async () => {
    await borrowedBookComponentsPage.clickOnCreateButton();
    borrowedBookUpdatePage = new BorrowedBookUpdatePage();
    expect(await borrowedBookUpdatePage.getPageTitle()).to.eq('libraryApp.borrowedBook.home.createOrEditLabel');
    await borrowedBookUpdatePage.cancel();
  });

  it('should create and save BorrowedBooks', async () => {
    const nbButtonsBeforeCreate = await borrowedBookComponentsPage.countDeleteButtons();

    await borrowedBookComponentsPage.clickOnCreateButton();
    await promise.all([
      borrowedBookUpdatePage.setBorrowDateInput('2000-12-31'),
      borrowedBookUpdatePage.bookSelectLastOption(),
      borrowedBookUpdatePage.clientSelectLastOption()
    ]);
    expect(await borrowedBookUpdatePage.getBorrowDateInput()).to.eq('2000-12-31', 'Expected borrowDate value to be equals to 2000-12-31');
    await borrowedBookUpdatePage.save();
    expect(await borrowedBookUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await borrowedBookComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last BorrowedBook', async () => {
    const nbButtonsBeforeDelete = await borrowedBookComponentsPage.countDeleteButtons();
    await borrowedBookComponentsPage.clickOnLastDeleteButton();

    borrowedBookDeleteDialog = new BorrowedBookDeleteDialog();
    expect(await borrowedBookDeleteDialog.getDialogTitle()).to.eq('libraryApp.borrowedBook.delete.question');
    await borrowedBookDeleteDialog.clickOnConfirmButton();

    expect(await borrowedBookComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
