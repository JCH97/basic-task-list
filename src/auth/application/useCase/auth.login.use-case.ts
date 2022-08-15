import { Either, left, right } from "src/shared/core/Either";
import { AppError } from "../../../shared/core/errors/AppError";
import { Result } from "../../../shared/core/Result";
import { IUseCase } from "../../../shared/core/interfaces/IUseCase";
import { Injectable, Logger } from "@nestjs/common";
import { User } from "src/user/domain/entities/user.entity";
import { ValidateDto } from "../dtos/validate.dto";
import { ValidateUserUseCase } from "./auth.validate.use-case";

export type LoginUserUseCaseResponse = Either<AppError.UnexpectedErrorResult<User>
  | AppError.ValidationErrorResult<User>,
  Result<User>>;

@Injectable()
export class LoginUserUseCase implements IUseCase<ValidateDto, Promise<LoginUserUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly validateUserUseCase: ValidateUserUseCase) {
    this._logger = new Logger("LoginUserUseCase");
  }

  async execute(request: ValidateDto): Promise<LoginUserUseCaseResponse> {
    this._logger.log("Executing...");

    try {

      let userOrError = await this.validateUserUseCase.execute(request);
      if (userOrError.isLeft()) {
        return left(userOrError.value);
      }

      let user = userOrError.value.unwrap();

      return right(Result.Ok(user));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
