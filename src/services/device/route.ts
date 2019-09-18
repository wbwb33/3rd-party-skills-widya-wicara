import Device from "./controller";
import { Endpoint } from "../../utils";
import { Auth } from "../../middleware/auth";
import { Scope } from "../../middleware/scope"

const route = new Endpoint("/device");

export default [
    route.get("/:device_key", [Auth.verifyToken, Device.show]),
    route.post("/", [Auth.verifyToken, Device.create]),
    // route.put("/:id", [Auth.verifyToken, Device.update]),
    route.delete("/:device_key", [Auth.verifyToken, Device.destroy]),

    route.get("/", [Scope.development(), Auth.verifyToken, Device.index])
];
