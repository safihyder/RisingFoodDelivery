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
    async AddOrder({ email, orderdata }) {
        let order_date = new Date().toDateString()
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteOrderCollectionId,
                ID.unique(),
                {
                    orderdata: [JSON.stringify([{ 'order_date': order_date }, ...orderdata])],
                    email,
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: addOrder :: error", error);
        }
    }
    async updateOrder(id, { orderdata, newdata }) {
        let order_date = new Date().toDateString()
        try {
            return this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteOrderCollectionId,
                id,
                {
                    orderdata: [(JSON.stringify([{ 'order_date': order_date }, ...newdata])), ...orderdata]
                }
            )
        } catch (error) {
            c
            console.log("Appwrite serive :: updateDetail :: error", error);
        }
    }
    async deleteOrder(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteOrderCollectionId,
                slug
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteRestaurant :: error", error);
            return false;
        }
    }
    async getOrder(id) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteOrderCollectionId,
                id
            )
        } catch (error) {
            console.log("Appwrite serive :: getOrder :: error", error);
            return false
        }
    }
    // async getRestaurants(queries = [Query.equal("status", "active")]) {
    async getOrders(queries = []) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteOrderCollectionId,
                queries
            )
        } catch (error) {
            console.log("Appwrite serive :: getOrders :: error", error);
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