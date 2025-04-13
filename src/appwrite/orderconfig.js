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
                    deliveryStatus: 'pending',  // Initial status - pending, ready, picked, on-the-way, delivered
                    deliveryPartnerId: 'none'  // 'none' when no delivery partner is assigned
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: addOrder :: error", error);
        }
    }
    async updateOrder(id, { orderdata, newdata, deliveryStatus, deliveryPartnerId }) {
        try {
            const updateFields = {};

            // If we have new order data, update the orderdata field
            if (orderdata && newdata) {
                let order_date = new Date().toDateString()
                updateFields.orderdata = [(JSON.stringify([{ 'order_date': order_date }, ...newdata])), ...orderdata];
            }

            // If we have delivery status to update
            if (deliveryStatus) {
                updateFields.deliveryStatus = deliveryStatus;
            }

            // If we have a delivery partner ID to update
            if (deliveryPartnerId) {
                updateFields.deliveryPartnerId = deliveryPartnerId;
            }

            return this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteOrderCollectionId,
                id,
                updateFields
            )
        } catch (error) {
            console.log("Appwrite serive :: updateOrder :: error", error);
        }
    }

    // Update only the delivery status
    async updateDeliveryStatus(id, status) {
        try {
            return this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteOrderCollectionId,
                id,
                {
                    deliveryStatus: status
                }
            )
        } catch (error) {
            console.log("Appwrite service :: updateDeliveryStatus :: error", error);
        }
    }

    // Assign a delivery partner to an order
    async assignDeliveryPartner(id, partnerId) {
        try {
            return this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteOrderCollectionId,
                id,
                {
                    deliveryPartnerId: partnerId,
                    deliveryStatus: 'picked' // Automatically update status when assigned
                }
            )
        } catch (error) {
            console.log("Appwrite service :: assignDeliveryPartner :: error", error);
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

    // Get orders for a specific delivery partner
    async getOrdersByDeliveryPartner(partnerId, status = null) {
        try {
            const queries = [Query.equal("deliveryPartnerId", partnerId)];

            // Add status filter if provided
            if (status) {
                queries.push(Query.equal("deliveryStatus", status));
            }

            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteOrderCollectionId,
                queries
            )
        } catch (error) {
            console.log("Appwrite service :: getOrdersByDeliveryPartner :: error", error);
            return false;
        }
    }

    // Get available orders for delivery partners
    async getAvailableOrders() {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteOrderCollectionId,
                [
                    Query.equal("deliveryStatus", "ready"),
                    Query.equal("deliveryPartnerId", "none")
                ]
            )
        } catch (error) {
            console.log("Appwrite service :: getAvailableOrders :: error", error);
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