import { getCollection } from "./client.js";
import { COLLECTIONS } from "./collections.js";
export async function searchKnowledgeBase(query, category = "all", nResults = 5) {
    const collectionsToSearch = category === "all"
        ? Object.values(COLLECTIONS).map((c) => c.name)
        : Object.values(COLLECTIONS)
            .filter((c) => c.metadata.category === category)
            .map((c) => c.name);
    const results = [];
    for (const collectionName of collectionsToSearch) {
        try {
            const collection = await getCollection(collectionName);
            const queryResult = await collection.query({
                queryTexts: [query],
                nResults: nResults,
            });
            if (queryResult.documents[0]) {
                results.push(...queryResult.documents[0].map((doc, i) => ({
                    content: doc || "",
                    metadata: (queryResult.metadatas[0]?.[i] || {}),
                    distance: queryResult.distances?.[0]?.[i],
                })));
            }
        }
        catch (error) {
            console.error(`Error searching collection ${collectionName}:`, error);
        }
    }
    // Sort by relevance (lower distance = more relevant)
    results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    return results.slice(0, nResults);
}
export async function addDocument(collectionName, id, content, metadata) {
    const collection = await getCollection(collectionName);
    await collection.add({
        ids: [id],
        documents: [content],
        metadatas: [metadata],
    });
}
export async function addDocuments(collectionName, ids, contents, metadatas) {
    const collection = await getCollection(collectionName);
    await collection.add({
        ids,
        documents: contents,
        metadatas,
    });
}
//# sourceMappingURL=embeddings.js.map