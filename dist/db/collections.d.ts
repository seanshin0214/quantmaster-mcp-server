export type CollectionCategory = "foundations" | "regression" | "econometrics" | "advanced" | "meta" | "replication" | "code" | "journals";
export interface CollectionConfig {
    name: string;
    description: string;
    metadata: Record<string, string>;
}
export declare const COLLECTIONS: Record<string, CollectionConfig>;
export declare const COLLECTION_NAMES: string[];
//# sourceMappingURL=collections.d.ts.map