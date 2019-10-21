import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Resolver, Mutation, Arg } from "type-graphql";
import { UserGQL } from "../types/User";
import { UserEntity } from '../entity/UserEntity';
import { UserInputGQL } from '../types/UserInput';
import { SECRET } from '../scripts/authChecker'

@Resolver(() => UserGQL)
export class UserResolver {
    @Mutation(() => UserGQL)
    async login(
        @Arg("data", type => UserInputGQL) data: UserInputGQL
    ) {
        const user = new UserEntity()
        user.fullName = data.fullName
        user.email = data.email
        user.password = bcrypt.hashSync(data.password, 10)
        await user.save()

        const token = jwt.sign(
            {
                data: { id: user.id },
            },
            SECRET,
            {
                expiresIn: `10 days`,
            }
        )
        user.token = token
        
        return user
    }
}