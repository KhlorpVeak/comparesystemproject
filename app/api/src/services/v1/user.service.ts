import { jsonObjectFrom } from "kysely/helpers/mysql";
import { BaseService } from "../base.service.js";

export class UserService extends BaseService {

  // list me
  async getMe(userId: number) {
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
}

