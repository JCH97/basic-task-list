import { User } from "src/user/domain/entities/user.entity";
import { UserPersistence } from "../entities/user.persistence";
import { UserDto } from "../../application/dtos/user.dto";
import { PaginatedFindResult } from "../../../shared/core/PaginatedFindResult";


export class UserMapper {
  public static PersistToDomain(persist: UserPersistence): User {

    if (persist == null) return null;

    const domain = User.Create({
      ...persist
    }, persist?.id);

    // TODO: handle this
    if (domain.isFailure)
      throw new Error(domain.unwrapError().message);

    return domain.unwrap();
  }

  public static DomainToPersist(domain: User): Partial<UserPersistence> {

    return {
      id: domain._id.toString(),
      userName: domain.userName,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      email: domain.email,
      password: domain.password
    };
  }

  public static DomainToDto(domain: User): UserDto {
    return {
      id: domain._id.toString(),
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      email: domain.email,
      userName: domain.userName
    };
  }

  public static PaginatedToDto(pag: PaginatedFindResult<User>): PaginatedFindResult<UserDto> {
    return {
      items: pag.items.length > 0 ? pag.items.map(UserMapper.DomainToDto) : [],
      limit: pag.limit,
      totalPages: pag.totalPages,
      currentPage: pag.currentPage
    };
  }

}