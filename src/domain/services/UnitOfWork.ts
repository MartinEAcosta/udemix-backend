
// Se crea una clase abstracta con el fin de no tener que depender de una implementación directa del driver, debido a que esto
// romperia el encapsulamiento, pero no es su unica ventaja debido a que en el caso de que el dia mañana se cambie 
// el ODM o el tipo de base de datos, con unos pocos ajustes quedaria listo.
export abstract class UnitOfWork {

    // operations seria el trabajo que se va realizar dentro del caso de uso, basicamente el modo de uso es 
    // la instanciación de la funcion y un callback que en base a la respuesta del datasource responde que prosigue.
    abstract startTransaction<T>( operations : ( ts : TransactionSession ) => Promise<T> ) : Promise<T>;

}

export interface TransactionSession {
    
    commit() : Promise<void>;
    abort()  : Promise<void>;
    getSession() : any;

}