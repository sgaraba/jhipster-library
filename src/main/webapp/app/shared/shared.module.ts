import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LibrarySharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [LibrarySharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [LibrarySharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LibrarySharedModule {
  static forRoot() {
    return {
      ngModule: LibrarySharedModule
    };
  }
}
