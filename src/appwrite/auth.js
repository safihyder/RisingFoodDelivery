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

    } async login(email, password) {
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
}
const authService = new AuthService();
export default authService;