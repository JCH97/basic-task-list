import { Notes } from "../../domain/entities/notes.entities";
import { NotesPersistence } from "../entities/notes.persistence";
import { UserMapper } from "../../../user/infra/mappers/user.mappers";
import { NotesDto } from "../../application/dtos/notes.dto";
import { PaginatedFindResult } from "../../../shared/core/PaginatedFindResult";

export class NotesMapper {
  public static PersistToDomain(persist: NotesPersistence): Notes {
    const domain = Notes.Create({
      ...persist,
      userId: { id: persist.userId },
      user: persist.user ? UserMapper.PersistToDomain(persist.user) : null
    }, persist.id);

    // TODO: handle this
    if (domain.isFailure)
      throw new Error(domain.unwrapError().message);

    return domain.unwrap();
  }

  public static DomainToPersist(domain: Notes): Partial<NotesPersistence> {

    return {
      id: domain._id.toString(),
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      user: domain.userId,
      text: domain.text
    };
  }

  public static DomainToDto(domain: Notes): NotesDto {
    return {
      id: domain._id.toString(),
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      userId: domain.userId,
      text: domain.text
    };
  }

  public static PaginatedToDto(pag: PaginatedFindResult<Notes>): PaginatedFindResult<NotesDto> {
    return {
      items: pag.items.length > 0 ? pag.items.map(NotesMapper.DomainToDto) : [],
      limit: pag.limit,
      totalPages: pag.totalPages,
      currentPage: pag.currentPage
    };
  }

}
