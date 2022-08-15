import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataAccessModule } from "src/shared/modules/data-access/data-access.module";
import { FindByEmailUserUseCase } from "./application/useCases/user.find-by-email.use-case";
import { UserPersistence } from "./infra/entities/user.persistence";
import { UserRepository } from "./infra/repositories/user.repository";
import { CreateUserUseCase, UserUseCases } from "./application/useCases";
import { UserController } from "./presentation/controllers/user.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    DataAccessModule,
    TypeOrmModule.forFeature([UserPersistence]),
    forwardRef(() => AuthModule)
  ],
  providers: [
    UserRepository,
    ...UserUseCases],
  controllers: [UserController],
  exports: [FindByEmailUserUseCase, CreateUserUseCase]
})
export class UserModule {
}
