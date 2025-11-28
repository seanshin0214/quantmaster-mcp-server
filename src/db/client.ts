import { ChromaClient, Collection, DefaultEmbeddingFunction } from "chromadb";
import { COLLECTIONS } from "./collections.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let chromaClient: ChromaClient | null = null;
let embeddingFunction: DefaultEmbeddingFunction | null = null;
let isChromaAvailable = false;

export async function initializeDatabase(): Promise<void> {
  // 내장 모드: 로컬 파일 경로 사용 (HTTP 서버 불필요)
  const chromaDataPath = process.env.CHROMA_DATA_PATH ||
    path.resolve(__dirname, "../../chroma-data");

  try {
    embeddingFunction = new DefaultEmbeddingFunction();

    // PersistentClient 모드 - 별도 서버 없이 내장 실행
    const { ChromaClient: PersistentChromaClient } = await import("chromadb");

    // ChromaDB 1.x에서는 path 옵션으로 내장 모드 사용
    chromaClient = new PersistentChromaClient({
      path: chromaDataPath,
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
        // Collection creation failed, but continue
      }
    }

    isChromaAvailable = true;
    console.error(`ChromaDB initialized (embedded mode): ${chromaDataPath}`);
  } catch (error) {
    console.error("ChromaDB initialization failed - running without vector search");
    console.error("Error:", error instanceof Error ? error.message : error);
    isChromaAvailable = false;
  }
}

export function isVectorSearchAvailable(): boolean {
  return isChromaAvailable;
}

export function getChromaClient(): ChromaClient | null {
  return chromaClient;
}

export async function getCollection(name: string): Promise<Collection | null> {
  if (!chromaClient || !embeddingFunction || !isChromaAvailable) {
    return null;
  }
  try {
    return await chromaClient.getCollection({ name, embeddingFunction });
  } catch {
    return null;
  }
}
