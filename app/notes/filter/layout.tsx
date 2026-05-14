import type { ReactNode } from "react";
import css from "./NotesFilterLayout.module.css";

export default function NotesFilterLayout({
  children,
  sidebar,
  modal,
}: {
  children: ReactNode;
  sidebar: ReactNode;
  modal: ReactNode;
}) {
  return (
    <section className={css.layout}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <div className={css.content}>{children}</div>
      {modal}
    </section>
  );
}
