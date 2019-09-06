import Pairing from "./controller";
import { Endpoint } from "../../utils";
import { Auth } from "../../middleware/auth";

const route = new Endpoint("/pairing");

export default [
    route.get("/", [Auth.verifyToken, Pairing.index]),
    route.post("/", [Auth.verifyToken, Pairing.pair]),
    route.put("/name/:device_key", [Auth.verifyToken, Pairing.update_name]),
    route.delete("/:device_key", [Auth.verifyToken, Pairing.destroy]),
];
