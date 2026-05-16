import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import NotesClient from "./Notes.client";
import { fetchNotes } from "../../../../lib/api";

const PER_PAGE = 12;
const siteUrl = "https://notehub.com";
const ogImage = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

type Props = {
  params: Promise<{ slug: string[] }>;
};

const getTagFromParams = async (params: Props["params"]) => {
  const { slug } = await params;
  return slug?.[0] ?? "all";
};

const getFilterLabel = (tag: string) => (tag === "all" ? "All" : tag);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = await getTagFromParams(params);
  const filterLabel = getFilterLabel(tag);
  const title = `${filterLabel} notes | NoteHub`;
  const description = `Browse ${filterLabel.toLowerCase()} notes in NoteHub.`;
  const url = `${siteUrl}/notes/filter/${tag}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${filterLabel} notes in NoteHub`,
        },
      ],
    },
  };
}

export default async function NotesFilterPage({ params }: Props) {
  const tag = await getTagFromParams(params);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", tag, 0, ""],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: PER_PAGE,
        tag: tag === "all" ? undefined : tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
