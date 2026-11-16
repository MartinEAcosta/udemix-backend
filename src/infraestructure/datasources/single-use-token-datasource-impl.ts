import { SingleUseTokenModel } from '../../data/mongo/models/single-use-token.model';
import { SingleUseTokenDatasource } from '../../domain/datasources/single-use-token-datasource';
import { SingleUseTokenResponseDto } from '../../domain/dtos/auth/single-use-token.response.dto';
import { SingleUseTokenPurpose } from '../../domain/entities/single-use-token.entity';
import { SingleUseTokenMapper } from '../mappers/single-use-token.mapper';

export class SingleUseTokenDatasourceImpl implements SingleUseTokenDatasource {

    async create( id_user : string , jti : string , purpose : SingleUseTokenPurpose , expires_at : Date ) : Promise<SingleUseTokenResponseDto> {
        const tokenCreated = await SingleUseTokenModel.create({ id_user , jti , purpose , expires_at });

        return SingleUseTokenMapper.fromSingleUseTokenResponseDto( tokenCreated );
    }

    async findValidByJti( jti : string , purpose : SingleUseTokenPurpose ) : Promise<SingleUseTokenResponseDto | null> {
        const token = await SingleUseTokenModel.findOne({ jti , purpose });
        if( !token ) return null;

        return SingleUseTokenMapper.fromSingleUseTokenResponseDto( token );
    }

    async consume( id : string ) : Promise<boolean> {
        const hasDeleted = await SingleUseTokenModel.findByIdAndDelete( id );

        return hasDeleted ? true : false;
    }

}
