import { BaseRepository } from "../../../shared/modules/data-access/typeorm/base.respository";
import { INotesRepository } from "../../domain/interfaces/IRepository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { NotesPersistence } from "../entities/notes.persistence";
import { NotesMapper } from "../mapper/notes.mapper";
import { Notes } from "../../domain/entities/notes.entities";

@Injectable()
export class NotesRepository extends BaseRepository<Notes, NotesPersistence> implements INotesRepository {
  constructor(@InjectRepository(NotesPersistence) _repository: Repository<NotesPersistence>) {
    super(_repository, NotesMapper.DomainToPersist, NotesMapper.PersistToDomain, "NotesRepository");
  }
}
