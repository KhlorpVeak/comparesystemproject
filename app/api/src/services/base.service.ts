import type { DatabaseType } from '@comparesystem/db';

export class BaseService {
  constructor(public readonly db: DatabaseType) { }
}