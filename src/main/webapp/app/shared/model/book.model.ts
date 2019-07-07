import { IPublisher } from 'app/shared/model/publisher.model';
import { IAuthor } from 'app/shared/model/author.model';

export interface IBook {
  id?: number;
  isbn?: string;
  name?: string;
  publishYear?: string;
  copies?: number;
  picture?: string;
  publisher?: IPublisher;
  authors?: IAuthor[];
}

export class Book implements IBook {
  constructor(
    public id?: number,
    public isbn?: string,
    public name?: string,
    public publishYear?: string,
    public copies?: number,
    public picture?: string,
    public publisher?: IPublisher,
    public authors?: IAuthor[]
  ) {}
}
