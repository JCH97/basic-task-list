import { Either, left, right } from "src/shared/core/Either";
import { AppError } from "../../../shared/core/errors/AppError";
import { Result } from "../../../shared/core/Result";
import { IUseCase } from "../../../shared/core/interfaces/IUseCase";
import { Injectable, Logger } from "@nestjs/common";
import { User } from "src/user/domain/entities/user.entity";
import { UserRepository } from "src/user/infra/repositories/user.repository";
import Optional from "../../../shared/core/Option";

export type FindByEmailUserUseCaseResponse = Either<AppError.UnexpectedErrorResult<User>
  | AppError.ValidationErrorResult<User>
  | AppError.ObjectNotExistResult<User>,
  Result<User>>;

@Injectable()
export class FindByEmailUserUseCase implements IUseCase<{ email: string }, Promise<FindByEmailUserUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly userRepository: UserRepository) {
    this._logger = new Logger("FindByIdUseCase");
  }

  async execute(request: { email: string }): Promise<FindByEmailUserUseCaseResponse> {
    this._logger.log("Executing...");

    try {
      return Optional(await this.userRepository.findOne({ email: request.email }))
        .okOr(new AppError.ObjectNotExist(`User with email ${request.email} doesn't exist`))
        .mapOrElse(
          //if error
          (err: AppError.ObjectNotExist) =>
            left(Result.Fail(err)),
          //if ok
          (user: User) =>
            right(Result.Ok(user))
        );

    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}