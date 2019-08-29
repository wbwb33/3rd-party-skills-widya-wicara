import userService from "./users/route";
import profileService from "./profile/route";

export default [
    ...userService,
    ...profileService,
];