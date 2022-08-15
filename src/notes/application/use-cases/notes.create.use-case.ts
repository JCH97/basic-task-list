import { Either, left, right } from "src/shared/core/Either";
import { AppError } from "../../../shared/core/errors/AppError";
import { Result } from "../../../shared/core/Result";
import { IUseCase } from "../../../shared/core/interfaces/IUseCase";
import { Injectable, Logger } from "@nestjs/common";
import { NotesCreateDto } from "../dtos/notes.create.dto";
import { NotesRepository } from "src/notes/infra/repositories/notes.repository";
import { Notes } from "../../domain/entities/notes.entities";

export type CreateNotesUseCaseResponse = Either<AppError.UnexpectedErrorResult<Notes>
  | AppError.ValidationErrorResult<Notes>,
  Result<Notes>>;

@Injectable()
export class CreateNotesUseCase implements IUseCase<NotesCreateDto, Promise<CreateNotesUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly notesRepository: NotesRepository) {
    this._logger = new Logger("CreateNotesUseCase");
  }

  async execute(request: NotesCreateDto, userId: string): Promise<CreateNotesUseCaseResponse> {
    this._logger.log("Executing...");

    const domainOrError: Result<Notes> = Notes.New({
      ...request,
      userId: { id: userId }
    });

    if (domainOrError.isFailure)
      return left(domainOrError);

    const note: Notes = domainOrError.unwrap();

    try {
      await this.notesRepository.save(note);
      return right(Result.Ok(note));
    } catch (error) {
      return left(Result.Fail(new AppError.UnexpectedError(error)));
    }
  }
}
