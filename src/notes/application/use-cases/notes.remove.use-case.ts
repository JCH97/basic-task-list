import { AppError } from "../../../shared/core/errors/AppError";
import { Injectable, Logger } from "@nestjs/common";
import { Either, left, right } from "../../../shared/core/Either";
import { NotesRepository } from "../../infra/repositories/notes.repository";
import { IUseCase } from "../../../shared/core/interfaces/IUseCase";
import { Result } from "../../../shared/core/Result";
import Optional from "src/shared/core/Option";
import { Notes } from "../../domain/entities/notes.entities";

export type RemoveNotesUseCaseResponse =
  Either<AppError.UnexpectedErrorResult<Notes>
    | AppError.ValidationErrorResult<Notes>
    | AppError.ObjectNotExistResult<Notes>,
    Result<Notes>>;

@Injectable()
export class RemoveNotesUseCase implements IUseCase<{ id: string }, Promise<RemoveNotesUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly notesRepository: NotesRepository) {
    this._logger = new Logger("RemoveNotesUseCase");
  }

  async execute(request: { id: string }, userId: string): Promise<RemoveNotesUseCaseResponse> {
    const notes = Optional(await this.notesRepository.findById(request.id));

    if (notes.isNone())
      return left(Result.Fail(new AppError.ObjectNotExist(`Note with id ${request.id} doesn't exist`)));

    if (notes.unwrap().userId.id != userId)
      return left(Result.Fail(new AppError.ValidationError("Unauthorized")));

    try {
      await this.notesRepository.drop(notes.unwrap());
      return right(Result.Ok(notes.unwrap()));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
