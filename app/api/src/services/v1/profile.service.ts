import { BaseService } from "../base.service.js";
import type { LoginMeRequest, RegisterProfileRequest } from "@comparesystem/shared";
import crypto from "crypto";

export class ProfileService extends BaseService {

    // register user
    async register(query: RegisterProfileRequest) {
        const { last_name, first_name, email, password } = query;

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // save data user
        await this.db
            .insertInto("users")
            .values({
                email,
                password: hashedPassword,
                created_at: new Date(),
                updated_at: new Date(),
                login_type: 1,
            })
            .executeTakeFirstOrThrow();

        // get user id
        const userId = await this.db
            .selectFrom("users")
            .select(["users.id"])
            .where("users.email", "=", email)
            .executeTakeFirst();

        // save data profile
        await this.db
            .insertInto("profile")
            .values({
                last_name,
                first_name,
                userId: userId?.id,
                created_at: new Date(),
                updated_at: new Date(),
            })
            .executeTakeFirstOrThrow();

        return { success: true };
    }

    // login profile
    async loginMe(query: LoginMeRequest) {
        const { email, password } = query;
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        const user = await this.db
            .selectFrom("users")
            .where("users.email", "=", email)
            .where("users.password", "=", hashedPassword)
            .select(["users.id", "users.email", "users.password"])
            .executeTakeFirstOrThrow();

        const token = crypto.randomUUID();
        const expiredAt = new Date(new Date().getTime() + 1488 * 60 * 60 * 1000);

        await this.db
            .insertInto("user_session")
            .values({
                userId: user.id,
                token: token,
                created_at: new Date(),
                updated_at: new Date(),
                expired_at: expiredAt,
            })
            .executeTakeFirstOrThrow();

        return { token, expiredAt, type: 1 };
    }
}
