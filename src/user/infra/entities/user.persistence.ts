import { PersistentEntity } from "../../../shared/modules/data-access/typeorm/base.entity";
import { Column, Entity, Index, OneToMany } from "typeorm";
import { NotesPersistence } from "../../../notes/infra/entities/notes.persistence";

@Entity("user")
@Index(["id"], { unique: true })
export class UserPersistence extends PersistentEntity {
  @Column({ type: "text" })
  userName: string;

  @Column({ type: "text" })
  email: string;

  @Column({ type: "text" })
  password: string;

  @OneToMany(
    () => NotesPersistence,
    n => n.user,
    {}
  )
  notes: NotesPersistence[];
}