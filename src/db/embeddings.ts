import { getCollection } from "./client.js";
import { COLLECTIONS, CollectionCategory } from "./collections.js";
import type { Metadata } from "chromadb";

export interface SearchResult {
  content: string;
  metadata: Record<string, string | number | boolean>;
  distance?: number;
}

export async function searchKnowledgeBase(
  query: string,
  category: CollectionCategory | "all" = "all",
  nResults: number = 5
): Promise<SearchResult[]> {
  const collectionsToSearch =
    category === "all"
      ? Object.values(COLLECTIONS).map((c) => c.name)
      : Object.values(COLLECTIONS)
          .filter((c) => c.metadata.category === category)
          .map((c) => c.name);

  const results: SearchResult[] = [];

  for (const collectionName of collectionsToSearch) {
    try {
      const collection = await getCollection(collectionName);
      const queryResult = await collection.query({
        queryTexts: [query],
        nResults: nResults,
      });

      if (queryResult.documents[0]) {
        results.push(
          ...queryResult.documents[0].map((doc, i) => ({
            content: doc || "",
            metadata: (queryResult.metadatas[0]?.[i] || {}) as Record<string, string | number | boolean>,
            distance: queryResult.distances?.[0]?.[i],
          }))
        );
      }
    } catch (error) {
      console.error(`Error searching collection ${collectionName}:`, error);
    }
  }

  // Sort by relevance (lower distance = more relevant)
  results.sort((a, b) => (a.distance || 0) - (b.distance || 0));

  return results.slice(0, nResults);
}

export async function addDocument(
  collectionName: string,
  id: string,
  content: string,
  metadata: Metadata
): Promise<void> {
  const collection = await getCollection(collectionName);
  await collection.add({
    ids: [id],
    documents: [content],
    metadatas: [metadata],
  });
}

export async function addDocuments(
  collectionName: string,
  ids: string[],
  contents: string[],
  metadatas: Metadata[]
): Promise<void> {
  const collection = await getCollection(collectionName);
  await collection.add({
    ids,
    documents: contents,
    metadatas,
  });
}
