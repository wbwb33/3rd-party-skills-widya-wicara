import User from "./controller";
import { Endpoint } from "../../utils";
import { Auth } from "../../middleware/auth"
import { Scope } from "../../middleware/scope";

const route = new Endpoint("/user");

export default [
    route.put("/", [Auth.verifyToken, User.update]),
    route.put("/update-password", [Auth.verifyToken, User.updatePassword]),
    route.post("/", User.register),
    route.post("/login", User.login),

    route.get("/all", [Scope.development(), Auth.verifyToken, User.get_all]),
];
