import { IRepository } from "../../../shared/core/interfaces/IRepository";
import { Notes } from "../entities/notes.entities";

export interface INotesRepository extends IRepository<Notes> {
};
