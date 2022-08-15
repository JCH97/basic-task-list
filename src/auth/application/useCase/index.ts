import { ValidateUserUseCase } from "./auth.validate.use-case";
import { RegisterUseCase } from "./auth.register.use-case";
import { LoginUserUseCase } from "./auth.login.use-case";

export * from "./auth.validate.use-case";
export * from "./auth.register.use-case";
export * from "./auth.login.use-case";

export const AuthUseCases = [
  ValidateUserUseCase,
  RegisterUseCase,
  LoginUserUseCase
];