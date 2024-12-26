const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteResCollectionId: String(import.meta.env.VITE_APPWRITE_RESTAURANT_COLLECTION_ID),
    appwriteOrderCollectionId: String(import.meta.env.VITE_APPWRITE_ORDER_COLLECTION_ID),
    appwriteItemCollectionId: String(import.meta.env.VITE_APPWRITE_ITEM_COLLECTION_ID),
    appwriteResBucketId: String(import.meta.env.VITE_APPWRITE_RES_BUCKET_ID),
    appwriteItemBucketId: String(import.meta.env.VITE_APPWRITE_ITEM_BUCKET_ID),
}
export default conf