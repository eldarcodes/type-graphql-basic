import { MyContext } from "@main/types/MyContext";
import { Ctx, Mutation, Resolver } from "type-graphql";

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() { req }: MyContext): Promise<boolean> {
    return new Promise((res, rej) =>
      req.session.destroy((error) => {
        if (error) {
          console.log(error);
          rej(false);
        }

        res(true);
      })
    );
  }
}
