import Profile from "./controller";
import { Endpoint } from "../../utils/";

const route = new Endpoint("/profile");

export default [
    route.get("/", Profile.index),
    route.get("/:id", Profile.show),
    route.get("/:type/edit", Profile.edit)
];
