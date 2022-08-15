import { Either, left, right } from "src/shared/core/Either";
import { AppError } from "../../../shared/core/errors/AppError";
import { Result } from "../../../shared/core/Result";
import { IUseCase } from "../../../shared/core/interfaces/IUseCase";
import { Injectable, Logger } from "@nestjs/common";
import { User } from "src/user/domain/entities/user.entity";
import { UserRepository } from "src/user/infra/repositories/user.repository";

export type FindByIdUserUseCaseResponse = Either<AppError.UnexpectedErrorResult<User>
  | AppError.ValidationErrorResult<User>,
  Result<User>>;

@Injectable()
export class FindByIdUserUseCase implements IUseCase<{ id: string }, Promise<FindByIdUserUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly userRepository: UserRepository) {
    this._logger = new Logger("FindByIdUseCase");
  }

  async execute(request: { id: string }): Promise<FindByIdUserUseCaseResponse> {
    this._logger.log("Executing...");

    try {
      const userDomain = await this.userRepository.findById(request.id);
      return right(Result.Ok(userDomain));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}