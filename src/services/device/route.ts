import Device from "./controller";
import { Endpoint } from "../../utils";
import { Auth } from "../../middleware/auth";
import { Scope } from "../../middleware/scope"
import { DeviceAuth } from "../../middleware/connection_from_device";

const route = new Endpoint("/device");

export default [
    route.get("/", [Scope.development(), Auth.verifyToken, Device.index]),

    route.post("/set", [DeviceAuth.verifyDeviceToken, Device.update_connection]),

    route.get("/:device_key", [Auth.verifyToken, Device.show]),
    route.post("/", [Auth.verifyToken, Device.create]),
    route.delete("/:device_key", [Auth.verifyToken, Device.destroy]),
];
