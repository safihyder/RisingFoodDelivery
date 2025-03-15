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
    async AddRestaurant({ name, address, image, description, userId, subscriptionPlan, billingCycle }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteResCollectionId,
                ID.unique(),
                {
                    name,
                    address,
                    image,
                    description,
                    userId,
                    subscriptionPlan,
                    billingCycle
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: addRestaurant :: error", error);
        }
    }
    async updateDetail(slug, { name, address, image, description, status }) {
        try {
            return this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteResCollectionId,
                slug,
                {
                    name,
                    address,
                    image,
                    description,
                    status
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: updateDetail :: error", error);
        }
    }
    async deleteRestaurant(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteResCollectionId,
                slug
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteRestaurant :: error", error);
            return false;
        }
    }
    async getRestaurant(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteResCollectionId,
                slug
            )
        } catch (error) {
            console.log("Appwrite serive :: getRestaurant :: error", error);
            return false
        }
    }
    // async getRestaurants(queries = [Query.equal("status", "active")]) {
    async getRestaurants(queries = []) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteResCollectionId,
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
                conf.appwriteResBucketId,
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
                conf.appwriteResBucketId,
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
            conf.appwriteResBucketId,
            fileId

        )
    }
}
const resservice = new Service();
export default resservice;