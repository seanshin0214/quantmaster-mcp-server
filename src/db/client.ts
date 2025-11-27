import { ChromaClient, Collection, DefaultEmbeddingFunction } from "chromadb";
import { COLLECTIONS } from "./collections.js";

let chromaClient: ChromaClient | null = null;
const embeddingFunction = new DefaultEmbeddingFunction();

export async function initializeDatabase(): Promise<void> {
  const chromaPath = process.env.CHROMA_PATH || "./chroma-data";

  chromaClient = new ChromaClient({
    path: chromaPath,
  });

  // Ensure all collections exist
  for (const collectionConfig of Object.values(COLLECTIONS)) {
    try {
      await chromaClient.getOrCreateCollection({
        name: collectionConfig.name,
        metadata: collectionConfig.metadata,
        embeddingFunction: embeddingFunction,
      });
    } catch (error) {
      console.error(`Failed to create collection ${collectionConfig.name}:`, error);
    }
  }

  console.error("ChromaDB initialized successfully");
}

export function getChromaClient(): ChromaClient {
  if (!chromaClient) {
    throw new Error("ChromaDB client not initialized. Call initializeDatabase() first.");
  }
  return chromaClient;
}

export async function getCollection(name: string): Promise<Collection> {
  const client = getChromaClient();
  return await client.getCollection({ name, embeddingFunction });
}
