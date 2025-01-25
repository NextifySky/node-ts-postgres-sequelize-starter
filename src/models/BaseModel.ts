import { Model, FindAndCountOptions, ModelStatic } from "sequelize";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

interface PaginationResult<T> {
  items: T[];
  pagination: PaginationInfo;
}

class BaseModel<
  T extends {} = any,
  T2 extends {} = any
> extends Model /*<T, T2>*/ {
  /**
   * Paginate method for models
   * @param page Page number (defaults to 1)
   * @param limit Number of items per page (defaults to 10)
   * @param options Additional options for `findAndCountAll`
   * @returns Paginated result with data and pagination info
   */
  static async paginate<T>(
    this: ModelStatic<BaseModel>, // Ensures `this` is of the correct type
    page: number = 1,
    limit: number = 10,
    options: FindAndCountOptions = {}
  ): Promise<PaginationResult<T>> {
    const offset: number = (page - 1) * limit;

    // Cast `this` to `ModelStatic<BaseModel>` to ensure compatibility
    const { rows, count: totalItems } = (await (
      this as ModelStatic<BaseModel>
    ).findAndCountAll({
      ...options,
      limit,
      offset,
    })) as { rows: T[]; count: number }; // Type cast for rows and count

    const totalPages: number = Math.ceil(totalItems / limit);
    return {
      items: rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        limit,
      },
    };
  }
}

export default BaseModel;
