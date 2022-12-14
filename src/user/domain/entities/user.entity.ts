import { DomainEntity } from "../../../shared/domain/entity.abstract";
import { Result } from "../../../shared/core/Result";
import { Guard } from "src/shared/core/Guard";
import { AppError } from "src/shared/core/errors/AppError";
import { hashSync } from "bcrypt";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";

type UserProps = {
  userName: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  password: string;
};

type newUserProps = Omit<UserProps,
  "id" | "createdAt" | "updatedAt">;

type updateUserProps = {
  username?: string;
  password?: string;
};


export class User extends DomainEntity<UserProps> {

  get userName(): string {
    return this.props.userName;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  public static New(props: newUserProps): Result<User> {
    const ans: Result<User> = this.Create({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    if (ans.isFailure) return Result.Fail(ans.unwrapError());

    return Result.Ok(ans.unwrap());
  }

  public static Create(props: UserProps, id: string = null): Result<User> {
    const shortNameOrError = Guard.againstAtLeast({
      argumentPath: "userName",
      numChars: 3,
      argument: props.userName
    });
    if (!shortNameOrError.succeeded) {
      return Result.Fail(new AppError.ValidationError(shortNameOrError.message));
    }

    const passwordOrError = Guard.againstAtLeast({ argumentPath: "password", numChars: 5, argument: props.password });
    if (!passwordOrError.succeeded) {
      return Result.Fail(new AppError.ValidationError(passwordOrError.message));
    }
    return Result.Ok(new User(props, new UniqueEntityID(id)));
  }

  public setPasswordHash(password: string) {
    if (password) {
      this.props.password = hashSync(password, 5);
    }
  }

  public Update(props: updateUserProps) {
    if (props.username) {
      const shortNameOrError = Guard.againstAtLeast({
        argumentPath: "shortname",
        numChars: 3,
        argument: props.username
      });
      if (!shortNameOrError.succeeded) {
        return Result.Fail(new AppError.ValidationError(shortNameOrError.message));
      }
      this.props.userName = props.username;
    }

    if (props.password) {
      const passwordOrError = Guard.againstAtLeast({
        argumentPath: "password",
        numChars: 5,
        argument: props.password
      });
      if (!passwordOrError.succeeded) {
        return Result.Fail(new AppError.ValidationError(passwordOrError.message));
      }
    }

    return Result.Ok(this);

    // this.props.name = props.name ?? this.props.name;
  }
}
