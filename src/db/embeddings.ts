import { getCollection, isVectorSearchAvailable } from "./client.js";
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
  // If ChromaDB is not available, return empty results with a note
  if (!isVectorSearchAvailable()) {
    return [{
      content: "Vector search is currently unavailable. The tool is operating without RAG support. To enable, start ChromaDB server: chroma run --path ./chroma-data",
      metadata: { source: "system", type: "notice" },
      distance: 0
    }];
  }

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
      if (!collection) continue;

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
      // Silently skip failed collections
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
  if (!isVectorSearchAvailable()) return;
  const collection = await getCollection(collectionName);
  if (!collection) return;
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
  if (!isVectorSearchAvailable()) return;
  const collection = await getCollection(collectionName);
  if (!collection) return;
  await collection.add({
    ids,
    documents: contents,
    metadatas,
  });
}
