import { jsonObjectFrom } from "kysely/helpers/mysql";
import { BaseService } from "../base.service.js";
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
    async getMeLocalStorage(userId) {
        return await this.db
            .selectFrom('users')
            .where('users.id', '=', userId)
            .select((eb) => [
            'users.login_type',
            jsonObjectFrom(eb.selectFrom('user_session')
                .where('user_session.userId', '=', userId)
                .select([
                'user_session.token',
                'user_session.expired_at'
            ])).as('user_session')
        ])
            .executeTakeFirst();
    }
}
