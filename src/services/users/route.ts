import user from "./controller";
import { route } from "../../utils";

const root: string = "/user";

export default [
    route(root).get("/", user.index),
];
