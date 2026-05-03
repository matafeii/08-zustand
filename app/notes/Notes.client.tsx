"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import SearchBox from "../../components/SearchBox/SearchBox";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import NoteForm from "../../components/NoteForm/NoteForm";
import NoteList from "../../components/NoteList/NoteList";
import { fetchNotes } from "../../lib/api";
import css from "./NotesPage.module.css";

const PER_PAGE = 12;

const NotesClient = () => {
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value);
    setPage(0);
  }, 500);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedSetSearch(value);
  };

  const { data: notesData } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page: page + 1,
        perPage: PER_PAGE,
        search: debouncedSearch || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected);
  };

  const notes = notesData?.notes ?? [];
  const pageCount = notesData?.totalPages ?? 0;

  return (
    <main className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={handleSearchChange} />
        {pageCount > 1 && (
          <Pagination
            pageCount={pageCount}
            onPageChange={handlePageChange}
            forcePage={page}
          />
        )}
        <button
          className={css.button}
          onClick={() => setIsModalOpen(true)}
          type="button"
        >
          Create note +
        </button>
      </header>

      {notes.length > 0 && <NoteList notes={notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </main>
  );
};

export default NotesClient;

