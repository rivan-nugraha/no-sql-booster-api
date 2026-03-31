import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
export const resourceProviders = [AuthModule, UserModule, DatabaseModule];
