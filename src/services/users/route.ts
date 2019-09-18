import User from "./controller";
import { Endpoint } from "../../utils";
import { Auth } from "../../middleware/auth"

const route = new Endpoint("/user");

export default [
    route.put("/", [Auth.verifyToken, User.update]),
    route.post("/", User.register),
    route.post("/login", User.login),
];
