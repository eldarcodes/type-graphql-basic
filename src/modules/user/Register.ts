import { hash } from "bcryptjs";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { User } from "./../../entity/User";

@Resolver()
export class Register {
  @Query(() => String)
  hello() {
    return "hello!";
  }

  @Mutation(() => User)
  async register(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("email") email: string,
    @Arg("password") password: string
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
