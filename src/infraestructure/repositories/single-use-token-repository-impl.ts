import { SingleUseTokenDatasource } from '../../domain/datasources/single-use-token-datasource';
import { SingleUseTokenEntity, SingleUseTokenPurpose } from '../../domain/entities/single-use-token.entity';
import { SingleUseTokenRepository } from '../../domain/repository/single-use-token-repository';

export class SingleUseTokenRepositoryImpl implements SingleUseTokenRepository {

    constructor(
        private readonly singleUseTokenDatasource : SingleUseTokenDatasource,
    ) { }

    async create( id_user : string , jti : string , purpose : SingleUseTokenPurpose , expires_at : Date ) : Promise<SingleUseTokenEntity> {
        try{
            const tokenCreated = await this.singleUseTokenDatasource.create( id_user , jti , purpose , expires_at );

            return SingleUseTokenEntity.fromObject( tokenCreated );
        }
        catch( error ){
            throw error;
        }
    }

    async findValidByJti( jti : string , purpose : SingleUseTokenPurpose ) : Promise<SingleUseTokenEntity | null> {
        try{
            const token = await this.singleUseTokenDatasource.findValidByJti( jti , purpose );

            return token ? SingleUseTokenEntity.fromObject( token ) : null;
        }
        catch( error ){
            throw error;
        }
    }

    async consume( id : string ) : Promise<boolean> {
        try{
            const hasConsumed = await this.singleUseTokenDatasource.consume( id );

            return hasConsumed;
        }
        catch( error ){
            throw error;
        }
    }

}
