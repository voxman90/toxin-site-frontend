export const getPageNumbers = (activePage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (1 <= activePage && activePage <= 4) {
    return [1, 2, 3, 4, 5, null, totalPages];
  }

  if (totalPages - 3 <= activePage && activePage <= totalPages) {
    return [1, null, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, null, activePage - 1, activePage, activePage + 1, null, totalPages];
};
