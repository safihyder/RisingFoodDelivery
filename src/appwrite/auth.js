import conf from "../conf/conf.js";
import { Client, Account, ID } from "appwrite";
export class AuthService {
    client = new Client();
    account;
    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)
        this.account = new Account(this.client)
    }
    async createAccount(name, email, password) {
        console.log(email, password)
        const userAccount = await this.account.create(ID.unique(), email, password, name);
        if (userAccount) {
            //call another method
            return this.login(email, password)
        } else {
            return userAccount;
        }

    }
    async login(email, password) {
        return await this.account.createEmailPasswordSession(email, password);
    }
    async getCurrentUser() {
        try {
            return this.account.get()
        } catch (error) {
            console.log("Appwrite serive :: getCurrentUser :: error", error);
        }
        return null
    }
    async logout() {
        console.log(this.account)
        try {
            await this.account.deleteSession("current");
            console.log("Logout user successfully")
        } catch (error) {
            console.log("Appwrite serive :: logout :: error", error);
        }
    }
    async isUserAdmin() {
        try {
            const user = await this.getCurrentUser();
            // Check if the user has the 'admin' label
            // This assumes you have set up labels in your Appwrite account
            return user && user.labels && user.labels.includes('admin');
        } catch (error) {
            console.log("Appwrite service :: isUserAdmin :: error", error);
            return false;
        }
    }
    async assignAdminRole(userId) {
        try {
            // This method would need to be implemented on the server side
            // as client-side operations cannot directly modify user labels
            // This is just a placeholder to indicate where you would add such functionality
            console.log("Admin role assignment would happen here for user:", userId);
            return true;
        } catch (error) {
            console.log("Appwrite service :: assignAdminRole :: error", error);
            return false;
        }
    }
}
const authService = new AuthService();
export default authService;