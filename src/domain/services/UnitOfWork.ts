
// Se crea una clase abstracta con el fin de no tener que depender de una implementación directa debido a que esto
// romperia el encapsulamiento, pero no es su unica ventaja debido a que en el caso de que el dia mañana se cambie 
// el ODM o la tipo de base de datos, solo se intercambie el driver en especifico.
export abstract class UnitOfWork{

    abstract withTransaction<T>( work : (repos : any) => Promise<T> ) : Promise<T>;

}