export class UrlConstant {
  public static readonly API_VERSION = '/v1';
  public static readonly BOOKS = {
    GET_BOOK: '/books',
    SEARCH: '/search',
    SEARCH_TYPE: '/search-{type}',
    AVATAR: '/avatar',
    NODE_BOOK: '/genres-tree/init-tree',
    FILE: '/file/{id}',
    DOWNLOAD: '/v1/attachment-file/download/{attachmentId}/{checksum}',
    GET_LIST: '/books/search'
  };

  public static readonly CATEGORIES = {
    NODE_TRANSLATOR: '/category/list/lib_dich_gia',
    NODE_AUTHOR: '/category/list/lib_tac_gia',
    NODE_LANGUAGE: '/category/list/lib_ngon_ngu',
    NODE_PUBLISHER: '/category/list/lib_nha_xuat_ban',
    NODE_STORE: '/category/list/lib_kho_sach',
    NODE_FORMAT: '/category/list/lib_kich_thuoc',
    NODE_PAGE_TRANSLATOR: '/category/pageable-key-check/lib_dich_gia',
    NODE_PAGE_AUTHOR: '/category/pageable-key-check/lib_tac_gia',
    NODE_PAGE_LANGUAGE: '/category/pageable-key-check/lib_ngon_ngu',
    NODE_GENDER: '/category/list/gioi_tinh'
  };

  public static readonly BOOK_EDITION = {
    GET_LIST_BOOK_EDITION: '/book-editions/list/'
  };


  public static readonly BOOK_EDITION_DETAIL = {
    GET_BOOK_DETAIL: '/book-edition-details',
    GET_BY_EDITION_ID: '/edition',
    GET_INFO: '/get-info/{bookNo}',
    GET_FILE: '/increment-book-no/{total}'
  };
  public static readonly GENRES = {
    URL_TREE: '/genres-tree/init-tree'
  };
  public static readonly MEMBERS = {
    GET_MEMBERS: '/members',
    GET_LIST_MEMBER: '/members/pageable'
  };
  public static readonly BOOK_LOANS = {
    GET_BOOK_LOANS: '/book-loans',
    BORROW_BOOKS: '/borrowing/{memberId}',
    RETURN_BOOKS: '/returning'
  };
  public static readonly BOOK_FAVOURITE = {
    GET_BOOK_FAVOURITE: '/favourite-books'
  };

}