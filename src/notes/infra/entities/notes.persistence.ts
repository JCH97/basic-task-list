import { PersistentEntity } from "../../../shared/modules/data-access/typeorm/base.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { UserPersistence } from "../../../user/infra/entities/user.persistence";

@Entity("notes")
@Index(["id"], { unique: true })
export class NotesPersistence extends PersistentEntity {
  @Column({ type: "text" })
  text: string;

  @Column({ type: "text", name: "user_id" })
  userId: string;

  @ManyToOne(
    () => UserPersistence,
    u => u.notes,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "user_id" })
  user: UserPersistence | any;

}
