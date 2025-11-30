import { UserModel } from "../models/UserModel";
import { signToken } from "../utils/jwt";

export const AuthService = {
  async register(username: string) {
    const existing = await UserModel.findByUsername(username);

    if (existing.data) {
      throw new Error("Username already exists");
    }

    const { data: newUser, error } = await UserModel.create(username);
    if (error) throw error;

    const token = signToken(newUser.id);

    return { user: newUser, token };
  },

  //Login can handle register as well
  async login(username: string) {
    const user = await UserModel.findByUsername(username);
    let token;
    if (!user.data) {
      const registerData = await this.register(username);
      token = registerData.token;
      return { user: registerData.user, token };
    } else {
      token = signToken(user.data.id);
      return { user: user.data, token };
    }
  },
};
