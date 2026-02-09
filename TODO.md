# TODO: Implement Pagination for Users Table

- [x] Add state for currentPage (default 1) and itemsPerPage (10)
- [x] Add useEffect to reset currentPage to 1 when search or status changes
- [x] Calculate start and end indices for slicing filteredUsers
- [x] Slice filteredUsers to get displayedUsers
- [x] Update table tbody to map over displayedUsers instead of filteredUsers
- [x] Update S.L column to show correct serial numbers (i + start + 1)
- [x] Update pagination-info to show correct range
- [x] Add Previous and Next buttons with appropriate disabling logic
