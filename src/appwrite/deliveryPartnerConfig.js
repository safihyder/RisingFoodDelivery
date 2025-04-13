import conf from "../conf/conf.js";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class DeliveryPartnerService {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async registerDeliveryPartner({
        name,
        email,
        phone,
        address,
        city,
        state,
        zip,
        availability,
        idProof,
        profilePhoto,
        userId
    }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteDeliveryPartnerCollectionId,
                ID.unique(),
                {
                    name,
                    email,
                    phone,
                    address,
                    city,
                    state,
                    zip,
                    availability,
                    idProof,
                    profilePhoto,
                    userId,
                    status: 'pending',  // Initial status: pending, approved, rejected
                    createdAt: new Date().toISOString()
                }
            );
        } catch (error) {
            console.log("Appwrite service :: registerDeliveryPartner :: error", error);
            throw error;
        }
    }

    async getDeliveryPartner(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteDeliveryPartnerCollectionId,
                slug
            );
        } catch (error) {
            console.log("Appwrite service :: getDeliveryPartner :: error", error);
            return false;
        }
    }

    async getDeliveryPartnerByUserId(userId) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteDeliveryPartnerCollectionId,
                [Query.equal("userId", userId)]
            );

            return response.documents.length > 0 ? response.documents[0] : null;
        } catch (error) {
            console.log("Appwrite service :: getDeliveryPartnerByUserId :: error", error);
            return null;
        }
    }

    async updateDeliveryPartner(slug, {
        name,
        phone,
        address,
        city,
        state,
        zip,
        availability,
        status
    }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteDeliveryPartnerCollectionId,
                slug,
                {
                    name,
                    phone,
                    address,
                    city,
                    state,
                    zip,
                    availability,
                    status
                }
            );
        } catch (error) {
            console.log("Appwrite service :: updateDeliveryPartner :: error", error);
            throw error;
        }
    }

    async getAllDeliveryPartners(queries = []) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteDeliveryPartnerCollectionId,
                queries
            );
        } catch (error) {
            console.log("Appwrite service :: getAllDeliveryPartners :: error", error);
            return false;
        }
    }

    // File upload service for ID proof and profile photo
    async uploadFile(file, bucketId = conf.appwriteDeliveryPartnerBucketId) {
        try {
            return await this.bucket.createFile(
                bucketId,
                ID.unique(),
                file
            );
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            throw error;
        }
    }

    async deleteFile(fileId, bucketId = conf.appwriteDeliveryPartnerBucketId) {
        try {
            await this.bucket.deleteFile(
                bucketId,
                fileId
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error", error);
            return false;
        }
    }

    getFilePreview(fileId, bucketId = conf.appwriteDeliveryPartnerBucketId) {
        return this.bucket.getFilePreview(
            bucketId,
            fileId
        );
    }
}

const deliveryPartnerService = new DeliveryPartnerService();
export default deliveryPartnerService; 