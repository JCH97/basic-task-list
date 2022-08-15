import { Either, left, right } from "src/shared/core/Either";
import { AppError } from "../../../shared/core/errors/AppError";
import { Result } from "../../../shared/core/Result";
import { IUseCase } from "../../../shared/core/interfaces/IUseCase";
import { Injectable, Logger } from "@nestjs/common";
import { User } from "src/user/domain/entities/user.entity";
import { UserCreateDto } from "../dtos/user.create.dto";
import { UserRepository } from "src/user/infra/repositories/user.repository";
import Optional from "../../../shared/core/Option";

export type CreateUserUseCaseResponse = Either<AppError.UnexpectedErrorResult<User>
  | AppError.ValidationErrorResult<User>,
  Result<User>>;

@Injectable()
export class CreateUserUseCase implements IUseCase<UserCreateDto, Promise<CreateUserUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly userRepository: UserRepository) {
    this._logger = new Logger("CreateUserUseCase");
  }

  async execute(request: UserCreateDto): Promise<CreateUserUseCaseResponse> {
    this._logger.log("Executing...");

    let exist = Optional(await this.userRepository.findOne({ email: request.email }));
    if (exist.isSome())
      return left(Result.Fail(new AppError.ValidationError("User already exist")));

    const userDomainOrError: Result<User> = User.New({ ...request });

    if (userDomainOrError.isFailure)
      return left(userDomainOrError);

    const user: User = userDomainOrError.unwrap();
    user.setPasswordHash(request.password);

    try {
      await this.userRepository.save(user);
      return right(Result.Ok(user));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}