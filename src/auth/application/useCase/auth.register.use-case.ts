import { Either, left, right } from "src/shared/core/Either";
import { AppError } from "../../../shared/core/errors/AppError";
import { Result } from "../../../shared/core/Result";
import { IUseCase } from "../../../shared/core/interfaces/IUseCase";
import { Injectable, Logger } from "@nestjs/common";
import { User } from "src/user/domain/entities/user.entity";
import { RegisterDto } from "../dtos/register.dto";
import { CreateUserUseCase } from "src/user/application/useCases/user.create.use-case";


export type RegisterUseCaseResponse = Either<AppError.UnexpectedErrorResult<User>
  | AppError.ValidationErrorResult<User>,
  Result<User>>;

@Injectable()
export class RegisterUseCase implements IUseCase<RegisterDto, Promise<RegisterUseCaseResponse>> {

  private _logger: Logger;

  constructor(
    private readonly createUserUseCase: CreateUserUseCase) {

    this._logger = new Logger("RegisterUserUseCase");
  }

  async execute(request: RegisterDto): Promise<RegisterUseCaseResponse> {
    this._logger.log("Executing...");

    try {
      const userOrError = await this.createUserUseCase.execute({ ...request });

      if (userOrError.isLeft())
        return left(Result.Fail(new AppError.ValidationError(userOrError.value.unwrapError().message)));


      const user = userOrError.value.unwrap();

      return right(Result.Ok(user));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}