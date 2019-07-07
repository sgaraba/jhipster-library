import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IBook, Book } from 'app/shared/model/book.model';
import { BookService } from './book.service';
import { IPublisher } from 'app/shared/model/publisher.model';
import { PublisherService } from 'app/entities/publisher';
import { IAuthor } from 'app/shared/model/author.model';
import { AuthorService } from 'app/entities/author';

@Component({
  selector: 'jhi-book-update',
  templateUrl: './book-update.component.html'
})
export class BookUpdateComponent implements OnInit {
  isSaving: boolean;

  publishers: IPublisher[];

  authors: IAuthor[];

  editForm = this.fb.group({
    id: [],
    isbn: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(13)]],
    name: [null, [Validators.required, Validators.maxLength(100)]],
    publishYear: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
    copies: [null, [Validators.required]],
    picture: [null, [Validators.maxLength(255)]],
    publisher: [],
    authors: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected bookService: BookService,
    protected publisherService: PublisherService,
    protected authorService: AuthorService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ book }) => {
      this.updateForm(book);
    });
    this.publisherService
      .query({ 'bookId.specified': 'false' })
      .pipe(
        filter((mayBeOk: HttpResponse<IPublisher[]>) => mayBeOk.ok),
        map((response: HttpResponse<IPublisher[]>) => response.body)
      )
      .subscribe(
        (res: IPublisher[]) => {
          if (!this.editForm.get('publisher').value || !this.editForm.get('publisher').value.id) {
            this.publishers = res;
          } else {
            this.publisherService
              .find(this.editForm.get('publisher').value.id)
              .pipe(
                filter((subResMayBeOk: HttpResponse<IPublisher>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<IPublisher>) => subResponse.body)
              )
              .subscribe(
                (subRes: IPublisher) => (this.publishers = [subRes].concat(res)),
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
              );
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    this.authorService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IAuthor[]>) => mayBeOk.ok),
        map((response: HttpResponse<IAuthor[]>) => response.body)
      )
      .subscribe((res: IAuthor[]) => (this.authors = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(book: IBook) {
    this.editForm.patchValue({
      id: book.id,
      isbn: book.isbn,
      name: book.name,
      publishYear: book.publishYear,
      copies: book.copies,
      picture: book.picture,
      publisher: book.publisher,
      authors: book.authors
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const book = this.createFromForm();
    if (book.id !== undefined) {
      this.subscribeToSaveResponse(this.bookService.update(book));
    } else {
      this.subscribeToSaveResponse(this.bookService.create(book));
    }
  }

  private createFromForm(): IBook {
    return {
      ...new Book(),
      id: this.editForm.get(['id']).value,
      isbn: this.editForm.get(['isbn']).value,
      name: this.editForm.get(['name']).value,
      publishYear: this.editForm.get(['publishYear']).value,
      copies: this.editForm.get(['copies']).value,
      picture: this.editForm.get(['picture']).value,
      publisher: this.editForm.get(['publisher']).value,
      authors: this.editForm.get(['authors']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBook>>) {
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

  trackPublisherById(index: number, item: IPublisher) {
    return item.id;
  }

  trackAuthorById(index: number, item: IAuthor) {
    return item.id;
  }

  getSelected(selectedVals: Array<any>, option: any) {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
