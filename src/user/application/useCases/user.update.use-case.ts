import { Either, left, right } from "src/shared/core/Either";
import { AppError } from "../../../shared/core/errors/AppError";
import { Result } from "../../../shared/core/Result";
import { IUseCase } from "../../../shared/core/interfaces/IUseCase";
import { Injectable, Logger } from "@nestjs/common";
import { User } from "src/user/domain/entities/user.entity";
import { UserRepository } from "src/user/infra/repositories/user.repository";
import { UserUpdateDto } from "../dtos/user.update.dto";
import Optional from "../../../shared/core/Option";

export type UpdateUserUseCaseResponse = Either<AppError.UnexpectedErrorResult<User>
  | AppError.ValidationErrorResult<User>
  | AppError.ObjectNotExistResult<User>,
  Result<User>>;


@Injectable()
export class UpdateUserUseCase implements IUseCase<UserUpdateDto, Promise<UpdateUserUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly userRepository: UserRepository) {
    this._logger = new Logger("UpdateUserUseCase");
  }

  async execute(request: UserUpdateDto, userId: string): Promise<UpdateUserUseCaseResponse> {
    this._logger.log("Executing");

    if (request.userId != userId)
      return left(Result.Fail(new AppError.ValidationError("Unauthorized")));

    const toUpdate = Optional(await this.userRepository.findById(request.userId));
    if (toUpdate.isNone())
      return left(Result.Fail(new AppError.ObjectNotExist(`User with id ${request.userId} doesn't exist`)));

    let forUpdate: User = toUpdate.unwrap();
    forUpdate.Update(request);

    try {
      await this.userRepository.save(forUpdate);
      return right(Result.Ok(forUpdate));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}