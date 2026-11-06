import covers from "./book-covers.json";
export function presentBook(value) {
 if (!value) return value;
 const book=typeof value.toObject==="function"?value.toObject():value;
 const cover=covers.find(item=>item.id===String(book._id));
 if(!cover)return book;
 const first=book.images?.[0]||book.image;
 const useLocal=!first||first==="/demo-book.svg"||first===cover.source||first===cover.image;
 return {
  ...book,
  images:useLocal?[cover.image,...(book.images||[]).slice(1)]:book.images,
  image:useLocal?cover.image:book.image,
  publisher:book.publisher==="Kitobdosh Demo"?"Kitobdosh":book.publisher,
  author:/^Demo\b/i.test(book.author||"")?"Muallif ko‘rsatilmagan":book.author
 };
}
