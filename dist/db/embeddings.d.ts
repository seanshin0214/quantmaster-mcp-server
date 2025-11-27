import { CollectionCategory } from "./collections.js";
import type { Metadata } from "chromadb";
export interface SearchResult {
    content: string;
    metadata: Record<string, string | number | boolean>;
    distance?: number;
}
export declare function searchKnowledgeBase(query: string, category?: CollectionCategory | "all", nResults?: number): Promise<SearchResult[]>;
export declare function addDocument(collectionName: string, id: string, content: string, metadata: Metadata): Promise<void>;
export declare function addDocuments(collectionName: string, ids: string[], contents: string[], metadatas: Metadata[]): Promise<void>;
//# sourceMappingURL=embeddings.d.ts.map