import { Either, left, right } from "src/shared/core/Either";
import { AppError } from "../../../shared/core/errors/AppError";
import { Result } from "../../../shared/core/Result";
import { IUseCase } from "../../../shared/core/interfaces/IUseCase";
import { Injectable, Logger } from "@nestjs/common";
import { NotesRepository } from "src/notes/infra/repositories/notes.repository";
import { Notes } from "../../domain/entities/notes.entities";
import { NotesUpdateDto } from "../dtos/notes.update.dto";
import Optional from "../../../shared/core/Option";

export type UpdateNotesUseCaseResponse = Either<AppError.UnexpectedErrorResult<Notes>
  | AppError.ValidationErrorResult<Notes>
  | AppError.ObjectNotExistResult<Notes>,
  Result<Notes>>;


@Injectable()
export class UpdateNotesUseCase implements IUseCase<NotesUpdateDto, Promise<UpdateNotesUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly notesRepository: NotesRepository) {
    this._logger = new Logger("UpdateNotesUseCase");
  }

  async execute(request: NotesUpdateDto, userId: string): Promise<UpdateNotesUseCaseResponse> {
    this._logger.log("Executing");

    const toUpdate = Optional(await this.notesRepository.findById(request.noteId));
    if (toUpdate.isNone())
      return left(Result.Fail(new AppError.ObjectNotExist(`Notes with id ${request.noteId} doesn't exist`)));

    if (toUpdate.unwrap().userId.id != userId)
      return left(Result.Fail(new AppError.ValidationError("Unauthorized")));

    let forUpdate: Notes = toUpdate.unwrap();
    forUpdate.Update(request);

    try {
      await this.notesRepository.save(forUpdate);
      return right(Result.Ok(forUpdate));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
