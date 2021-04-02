import { hash } from "bcryptjs";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { User } from "./../../entity/User";
import { RegisterInput } from "./register/RegisterInput";

@Resolver()
export class RegisterResolver {
  @Authorized()
  @Query(() => String)
  hello() {
    return "hello!";
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => User)
  async register(
    @Arg("data") { email, firstName, lastName, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    await user.save();

    return user;
  }
}
