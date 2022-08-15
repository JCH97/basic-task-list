import { Either, left, right } from "src/shared/core/Either";
import { AppError } from "../../../shared/core/errors/AppError";
import { Result } from "../../../shared/core/Result";
import { IUseCase } from "../../../shared/core/interfaces/IUseCase";
import { Injectable, Logger } from "@nestjs/common";
import { User } from "src/user/domain/entities/user.entity";
import { ValidateDto } from "../dtos/validate.dto";
import { compareSync } from "bcrypt";
import { FindByEmailUserUseCase } from "../../../user/application/useCases";

export type ValidateUserUseCaseResponse = Either<AppError.UnexpectedErrorResult<User>
  | AppError.ValidationErrorResult<User>,
  Result<User>>;

@Injectable()
export class ValidateUserUseCase implements IUseCase<ValidateDto, Promise<ValidateUserUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly userFindByEmail: FindByEmailUserUseCase) {
    this._logger = new Logger("ValidateUserUseCase");
  }

  async execute(request: ValidateDto): Promise<ValidateUserUseCaseResponse> {
    this._logger.log("Executing...");

    try {

      const userDomain = await this.userFindByEmail.execute({ email: request.email });

      if (userDomain.isLeft()) {
        return left(Result.Fail(new AppError.ValidationError("Invalid Email or Password")));
      }

      const user = userDomain.value.unwrap();

      if (!compareSync(request.password, user.password)) {
        return left(Result.Fail(new AppError.ValidationError("Invalid Email or Password")));
      }

      return right(Result.Ok(user));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}