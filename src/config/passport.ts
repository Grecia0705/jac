import passport from "passport";
import {Strategy} from "passport-local";
import UserModel from "../models/user/UserModel";

passport.use("local.login", new Strategy({
  usernameField: "email",
  passwordField: "password"
}, async (email: string, password: string, done: any) => {
  const user: any | null = await UserModel.FindUserByEmail({email});

  if (user) {
    const dbPassword: string = user.password;
    const match = await UserModel.ComparePassword({password, dbPassword});
    if (match) {
      return done(null, user);
    } else {
      return done(null, false, {message: "Verifica tus credenciales."});
    }
  } else {

    return done(null, false, {message: "Verifica tus credenciales."});
  }
}));

passport.serializeUser((user: any, done: any) => {
  done(null, user.userId);
});

passport.deserializeUser(async (id: string, done: any) => {
  const result = await UserModel.FindUserById({id});
  if(!result) return done(true, null);
  return done(null,result);
});
