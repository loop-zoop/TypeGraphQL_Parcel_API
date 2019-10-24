import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Resolver, Mutation, Arg } from "type-graphql";
import { UserGQL } from "../types/User";
import { UserEntity } from '../entity/UserEntity';
import { UserInputGQL } from '../types/UserInput';
import { SECRET } from '../scripts/authChecker'
import { ApolloError } from 'apollo-server';

@Resolver(() => UserGQL)
export class UserResolver {
    @Mutation(() => UserGQL)
    async signup(
        @Arg("data", type => UserInputGQL) data: UserInputGQL
    ) {
        const user = new UserEntity()
        user.email = data.email
        user.fullName = data.fullName
        user.password = bcrypt.hashSync(data.password, 10)
        await user.save()

        const token = jwt.sign(
            {
                data: {
                    id: user.id
                },
            },
            SECRET,
            {
                expiresIn: `2 days`,
            }
        )
        user.token = token

        return user
    };

    @Mutation(() => UserGQL)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string
    ) {

        const user = await UserEntity.findOneOrFail({
            where: { email },
        })
        if (!bcrypt.compareSync(password, user.password)) {
            throw new ApolloError(
                'Wrong email or password'
            )
        }

        const token = jwt.sign(
            {
                data: {
                    id: user.id
                },
            },
            SECRET,
            {
                expiresIn: `2 days`,
            }
        )
        user.token = token

        return user
    }
}