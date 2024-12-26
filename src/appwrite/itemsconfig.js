import conf from "../conf/conf.js";
import { Client, ID, Databases, Storage, Query } from "appwrite";
export class Service {
    client = new Client();
    databases;
    bucket;
    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client)
    }
    async addItem({ name, description, price, image, status, category, resid }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteItemCollectionId,
                ID.unique(),
                {
                    name,
                    description,
                    image,
                    status,
                    price,
                    category,
                    resid
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: addItem :: error", error);
        }
    }
    async updateDetail(slug, { title, content, image, status }) {
        try {
            return this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteItemCollectionId,
                slug,
                {
                    title,
                    content,
                    image,
                    status
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: updateDetail :: error", error);
        }
    }
    async deleteItem(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteItemCollectionId,
                slug
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteRestaurant :: error", error);
            return false;
        }
    }
    async getItem(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteItemCollectionId,
                slug
            )
        } catch (error) {
            console.log("Appwrite serive :: getRestaurant :: error", error);
            return false
        }
    }
    async getItems(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteItemCollectionId,
                queries
            )
        } catch (error) {
            console.log("Appwrite serive :: getRestaurants :: error", error);
            return false;
        }
    }
    //file upload service
    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteItemBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite serive :: uploadFile :: error", error);
        }
    }
    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteItemBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false;
        }
    }
    getFilePreview(fileId) {
        return this.bucket.getFilePreview(
            conf.appwriteItemBucketId,
            fileId

        )
    }
}
const itemservice = new Service();
export default itemservice;