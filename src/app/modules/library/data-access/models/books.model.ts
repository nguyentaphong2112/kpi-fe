// books-request.model.ts
import { NzUploadFile } from 'ng-zorro-antd/upload';

export class Books {
  title?: string;
  originalTitle?: string;
  subtitle?: string;
  genreId?: number;
  authorId?: string;
  summary?: string;
  languageId?: string;
  type?: string;
  tags?: string;
  tableOfContents?: string;
  listEditions?: EditionDto[] = [];

  fileAvatar?: NzUploadFile[];
  fileContent?: NzUploadFile[];
}

export class EditionDto {
  bookEditionId?: number;
  publishedYear?: number;
  storeId?: string;
  totalPages?: number;
  bookFormatId?: string;
  bookFormatName?: string;
  publisherId?: string;
  publisherName?: string;
  availableNumber?: number;
  borrowNumber?: number;
}

// BooksSearchForm
export class SearchForm {
  genreIds?: number[];
  translatorIds?: string[];
  authorIds?: string[];
  types?: string[];
  isFavourite?: boolean;
}
