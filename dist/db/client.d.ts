import { ChromaClient, Collection } from "chromadb";
export declare function initializeDatabase(): Promise<void>;
export declare function isVectorSearchAvailable(): boolean;
export declare function getChromaClient(): ChromaClient | null;
export declare function getCollection(name: string): Promise<Collection | null>;
//# sourceMappingURL=client.d.ts.map