import { Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext } from "./../../types/MyContext";

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
    return new Promise((resolve, reject) =>
      req.session.destroy((error) => {
        if (error) {
          console.log(error);
          return reject(false);
        }
        res.clearCookie("jid");

        return resolve(true);
      })
    );
  }
}
