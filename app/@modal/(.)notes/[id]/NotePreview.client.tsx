"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Modal from "../../../../components/Modal/Modal";
import { fetchNoteById } from "../../../../lib/api";
import css from "./NotePreview.module.css";

const NotePreviewClient = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(String(id)),
    enabled: Boolean(id),
    refetchOnMount: false,
  });

  return (
    <Modal onClose={() => router.back()}>
      {isLoading && <p>Loading, please wait...</p>}
      {(error || !note) && !isLoading && <p>Something went wrong.</p>}
      {note && (
        <div className={css.container}>
          <div className={css.header}>
            <h2 className={css.title}>{note.title}</h2>
            <button
              type="button"
              className={css.closeButton}
              onClick={() => router.back()}
              aria-label="Close modal"
            >
              x
            </button>
          </div>
          <p className={css.tag}>{note.tag}</p>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>
            {new Date(note.createdAt).toLocaleString()}
          </p>
        </div>
      )}
    </Modal>
  );
};

export default NotePreviewClient;
