import { BaseService } from "./base.service.js";
export class UserService extends BaseService {
    // list me
    async getMe(userId) {
        return await this.db
            .selectFrom('profile')
            .select([
            "profile.first_name",
            "profile.last_name",
            "profile.userId",
            "profile.created_at",
            "profile.updated_at"
        ])
            .where('profile.userId', '=', userId)
            .executeTakeFirst();
    }
    async UserListAll() {
        return await this.db.selectFrom('users').selectAll().execute();
    }
}
