import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { IBorrowedBook, BorrowedBook } from 'app/shared/model/borrowed-book.model';
import { BorrowedBookService } from './borrowed-book.service';
import { IBook } from 'app/shared/model/book.model';
import { BookService } from 'app/entities/book';
import { IClient } from 'app/shared/model/client.model';
import { ClientService } from 'app/entities/client';

@Component({
  selector: 'jhi-borrowed-book-update',
  templateUrl: './borrowed-book-update.component.html'
})
export class BorrowedBookUpdateComponent implements OnInit {
  isSaving: boolean;

  books: IBook[];

  clients: IClient[];
  borrowDateDp: any;

  editForm = this.fb.group({
    id: [],
    borrowDate: [],
    book: [],
    client: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected borrowedBookService: BorrowedBookService,
    protected bookService: BookService,
    protected clientService: ClientService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ borrowedBook }) => {
      this.updateForm(borrowedBook);
    });
    this.bookService
      .query({ 'borrowedBookId.specified': 'false' })
      .pipe(
        filter((mayBeOk: HttpResponse<IBook[]>) => mayBeOk.ok),
        map((response: HttpResponse<IBook[]>) => response.body)
      )
      .subscribe(
        (res: IBook[]) => {
          if (!this.editForm.get('book').value || !this.editForm.get('book').value.id) {
            this.books = res;
          } else {
            this.bookService
              .find(this.editForm.get('book').value.id)
              .pipe(
                filter((subResMayBeOk: HttpResponse<IBook>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<IBook>) => subResponse.body)
              )
              .subscribe(
                (subRes: IBook) => (this.books = [subRes].concat(res)),
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
              );
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    this.clientService
      .query({ 'borrowedBookId.specified': 'false' })
      .pipe(
        filter((mayBeOk: HttpResponse<IClient[]>) => mayBeOk.ok),
        map((response: HttpResponse<IClient[]>) => response.body)
      )
      .subscribe(
        (res: IClient[]) => {
          if (!this.editForm.get('client').value || !this.editForm.get('client').value.id) {
            this.clients = res;
          } else {
            this.clientService
              .find(this.editForm.get('client').value.id)
              .pipe(
                filter((subResMayBeOk: HttpResponse<IClient>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<IClient>) => subResponse.body)
              )
              .subscribe(
                (subRes: IClient) => (this.clients = [subRes].concat(res)),
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
              );
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  updateForm(borrowedBook: IBorrowedBook) {
    this.editForm.patchValue({
      id: borrowedBook.id,
      borrowDate: borrowedBook.borrowDate,
      book: borrowedBook.book,
      client: borrowedBook.client
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const borrowedBook = this.createFromForm();
    if (borrowedBook.id !== undefined) {
      this.subscribeToSaveResponse(this.borrowedBookService.update(borrowedBook));
    } else {
      this.subscribeToSaveResponse(this.borrowedBookService.create(borrowedBook));
    }
  }

  private createFromForm(): IBorrowedBook {
    return {
      ...new BorrowedBook(),
      id: this.editForm.get(['id']).value,
      borrowDate: this.editForm.get(['borrowDate']).value,
      book: this.editForm.get(['book']).value,
      client: this.editForm.get(['client']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBorrowedBook>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackBookById(index: number, item: IBook) {
    return item.id;
  }

  trackClientById(index: number, item: IClient) {
    return item.id;
  }
}
