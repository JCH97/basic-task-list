import { DomainEntity } from "../../../shared/domain/entity.abstract";
import { Result } from "../../../shared/core/Result";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { User } from "../../../user/domain/entities/user.entity";

type NotesProps = {
  createdAt: Date;
  updatedAt: Date;
  text: string;
  userId?: { id: string };
  user?: User;
};


type newNotesProps = Omit<NotesProps,
  "id" | "createdAt" | "updatedAt">;

export class Notes extends DomainEntity<NotesProps> {

  get text(): string {
    return this.props.text;
  }

  get userId(): { id: string } {
    return this.props.userId;
  }

  get user(): User {
    return this.props.user;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public static New(props: newNotesProps): Result<Notes> {
    const ans: Result<Notes> = this.Create({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    if (ans.isFailure) return Result.Fail(ans.unwrapError());

    return Result.Ok(ans.unwrap());
  }

  public static Create(props: NotesProps, id: string = null): Result<Notes> {
    // set guards here

    return Result.Ok(new Notes(props, new UniqueEntityID(id)));
  }

  public Update(props: any) {
    this.props.text = props.text ?? this.props.text;
    this.props.userId = props.userId ?? this.props.userId;

    this.props.updatedAt = new Date();
  }
}
