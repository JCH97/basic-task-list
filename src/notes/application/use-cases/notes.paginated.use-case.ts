import { Either, left, right } from "src/shared/core/Either";
import { AppError } from "../../../shared/core/errors/AppError";
import { Result } from "../../../shared/core/Result";
import { IUseCase } from "../../../shared/core/interfaces/IUseCase";
import { Injectable, Logger } from "@nestjs/common";
import { PageParams } from "src/shared/core/PaginatorParams";
import { PaginatedFindResult } from "../../../shared/core/PaginatedFindResult";
import { NotesRepository } from "../../infra/repositories/notes.repository";
import { Notes } from "../../domain/entities/notes.entities";
import { NotesPaginatedDto } from "../dtos/notes.paginated.dto";
import { Equal } from "typeorm";

export type PaginatedNotesUseCaseResponse = Either<AppError.UnexpectedErrorResult<PaginatedFindResult<Notes>>
  | AppError.ValidationErrorResult<PaginatedFindResult<Notes>>,
  Result<PaginatedFindResult<Notes>>>;

@Injectable()
export class PaginatedNotesUseCase implements IUseCase<NotesPaginatedDto, Promise<PaginatedNotesUseCaseResponse>> {

  private _logger: Logger;

  constructor(private readonly notesRepository: NotesRepository) {
    this._logger = new Logger("PaginatedNotesUseCase");
  }

  async execute(request: NotesPaginatedDto, userId: string): Promise<PaginatedNotesUseCaseResponse> {
    this._logger.log("Executing..");

    try {
      return (
        await PageParams.create(
          request.pageParams
        ).mapAsync(async (pageParams: PageParams) =>
          this.notesRepository.getPaginated(
            pageParams,
            {
              ...request.filter,
              userId: Equal(userId)
            }
          )
        )
      ).mapOrElse(
        // Err case
        err => left(Result.Fail(err)),
        // Ok case
        result => right(Result.Ok(result))
      );
    } catch (err) {
      return left(Result.Fail(new AppError.UnexpectedError(err)));
    }
  }
}
