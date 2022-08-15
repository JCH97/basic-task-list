import { CreateUserUseCase } from "./user.create.use-case";
import { FindByIdUserUseCase } from "./user.find-by-id.use-case";
import { FindByEmailUserUseCase } from "./user.find-by-email.use-case";
import { PaginatedUserUseCase } from "./user.paginate.use-case";
import { UpdateUserUseCase } from "./user.update.use-case";

export * from "./user.create.use-case";
export * from "./user.find-by-email.use-case";
export * from "./user.find-by-id.use-case";
export * from "./user.paginate.use-case";
export * from "./user.update.use-case";

export const UserUseCases = [
  CreateUserUseCase,
  FindByIdUserUseCase,
  FindByEmailUserUseCase,
  PaginatedUserUseCase,
  UpdateUserUseCase
];