import Book from "@/model/Book";
export async function getCollections() {
  const rows = await Book.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { count: -1, _id: 1 } }, { $limit: 3 }]);
  return rows.map(row => ({ title: row._id, count: `${row.count} ta kitob`, desc: `${row._id} bo‘limidagi mavjud kitoblar`, color: "from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40", btn: "bg-blue-500", icon: "📚", filter: row._id }));
}
