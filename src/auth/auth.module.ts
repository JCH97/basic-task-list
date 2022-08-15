import { forwardRef, Module } from "@nestjs/common";
import { AuthController } from "./controller/auth.controller";
import { DataAccessModule } from "../shared/modules/data-access/data-access.module";
import { UserModule } from "../user/user.module";
import { AuthUseCases, ValidateUserUseCase } from "./application/useCase";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./application/strategies/local.strategy";
import { SessionSerializer } from "./application/strategies/session.serializer";
import { LocalAuthGuard } from "./application/guards/local.auth.guard";

@Module({
  imports: [
    DataAccessModule,
    forwardRef(() => UserModule),
    PassportModule],
  providers: [
    ...AuthUseCases,
    LocalStrategy,
    SessionSerializer,
    LocalAuthGuard
  ],
  exports: [ValidateUserUseCase],
  controllers: [AuthController]
})
export class AuthModule {
}
