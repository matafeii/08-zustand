import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import NoteDetailsClient from "./NoteDetails.client";
import { fetchNoteById } from "../../../lib/api";

type Props = {
  params: Promise<{ id: string }>;
};

const siteUrl = "https://notehub.com";
const ogImage = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);
  const description = note.content
    ? note.content.slice(0, 160)
    : `Details for ${note.title} note.`;

  return {
    title: `${note.title} | NoteHub`,
    description,
    openGraph: {
      title: `${note.title} | NoteHub`,
      description,
      url: `${siteUrl}/notes/${id}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
    },
  };
}

export default async function NoteDetailsPage({ params }: Props) {
  const { id } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
