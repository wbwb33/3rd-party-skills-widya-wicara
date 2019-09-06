import userService from "./users/route";
import profileService from "./pairing/route";
import deviceService from "./device/route";
import pairingService from "./pairing/route";

export default [
    ...userService,
    ...profileService,
    ...deviceService,
    ...pairingService
];