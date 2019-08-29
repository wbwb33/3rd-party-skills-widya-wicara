import controller from "./controller";
import { route } from "../../utils/";

const root: string = "/profile";

export default [
    route(root).get("/", controller.index),
    route(root).get("/:id", controller.show),
];
