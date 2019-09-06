import { Request, Response } from "express";
import { Services } from "../base_services";
import { getRepository, UpdateResult } from "typeorm";
import { User } from "../users/entity";
import { Device } from "../device/entity";
import { validate } from "class-validator";

class PairingController extends Services {
    public index = async (req: Request, res: Response) => {
        const pairedDevice = await getRepository(User).findOne({
            where: {
                id: (req as any).user.id
            },
            select: ["id", "name"],
            relations: ["device"],
        });

        if (!pairedDevice) {
            return res.sendError("no device paired yet");
        } else {
            return res.sendOK({ action: "get paired device", data: pairedDevice });
        }

    };

    public pair = async (req: Request, res: Response) => {
        const id = (req as any).user.id;
        const repo = await getRepository(Device);

        // TODO: check if the req.body is exist
        if (!req.body.device_key) {
            return res.sendError("additional data is required!")
        }

        const deviceExist = await repo.createQueryBuilder('device')
            .where({ device_key: req.body.device_key })
            .getOne();

        const user = new User();
        user.id = id;

        const device = new Device();
        device.device_key = req.body.device_key;
        device.device_name = req.body.device_name;
        device.device_type = req.body.device_type;
        device.firmware_version = (deviceExist as any).firmware_version;
        device.device_ip = (deviceExist as any).device_ip;
        device.pairedTo = user;

        // console.log(device);
        const errors = await validate(device);

        if (errors.length > 0) {
            const err = errors.map(e => {
                const error = e.constraints;
                const property = e.property;
                return { property, error };
            });
            return res.send(err).status(400);
        }

        if (deviceExist) {
            try {
                const updateResult: UpdateResult = await repo.createQueryBuilder("device")
                    .update(Device, device)
                    .where("device_key = :device_key", { device_key: req.body.device_key })
                    .returning(["device_key", "device_name", "device_type"])
                    .execute();

                let name = await getRepository(User).find({ select: ['name'], where: { id: id } })

                // if (updateResult.raw.length > 0) {
                return res.sendInsertOK({
                    action: "success pairing device",
                    data: {
                        ...updateResult.raw[0],
                        ...{ paired_to: name[0].name }
                    }
                });

            } catch (error) {
                console.log(error);
                return res.sendError(error);
            }

        } else {
            return res.sendError({ message: `device with uuid: "${req.body.device_key}" not found` });

        }

    };

    public update_name = async (req: Request, res: Response) => {
        const id = (req as any).user.id;
        const repo = await getRepository(Device);
        const device_key = req.params.device_key;

        if (!req.body.device_name) {
            return res.sendError("device_name required")
        }

        const deviceExist = await repo.createQueryBuilder('device')
            .where({ device_key: device_key })
            .getOne();

        const user = new User();
        user.id = id;

        const device = new Device();
        device.device_key = device_key;
        device.device_name = req.body.device_name;
        device.device_type = (deviceExist as any).device_type;
        device.firmware_version = (deviceExist as any).firmware_version;
        device.device_ip = (deviceExist as any).device_ip;
        device.pairedTo = user;

        // console.log(device);
        const errors = await validate(device);

        if (errors.length > 0) {
            const err = errors.map(e => {
                const error = e.constraints;
                const property = e.property;
                return { property, error };
            });
            return res.send(err).status(400);
        }

        if (deviceExist) {
            try {
                const updateResult: UpdateResult = await repo.createQueryBuilder("device")
                    .update(Device, device)
                    .where("device_key = :device_key", { device_key: device_key })
                    .returning(["device_key", "device_name"])
                    .execute();

                let name = await getRepository(User).find({ select: ['name'], where: { id: id } })

                // if (updateResult.raw.length > 0) {
                return res.sendInsertOK({
                    action: "update device name",
                    data: {
                        ...updateResult.raw[0],
                        ...{ paired_to: name[0].name }
                    }
                });

            } catch (error) {
                console.log(error);
                return res.sendError(error);
            }

        } else {
            return res.sendError({ message: `device with uuid: "${device_key}" not found` });

        }

    }

    public destroy = async (req: Request, res: Response) => {
        const repo = await getRepository(Device);
        const device_key = req.params.device_key;

        const deviceExist = await repo.createQueryBuilder('device')
            .where({ device_key: device_key })
            .getOne();

        const device = new Device();
        device.device_key = device_key;
        device.device_name = (deviceExist as any).device_name;
        device.device_type = (deviceExist as any).device_type;
        device.firmware_version = (deviceExist as any).firmware_version;
        device.device_ip = (deviceExist as any).device_ip;
        device.pairedTo = null;

        // console.log(device);
        const errors = await validate(device);

        if (errors.length > 0) {
            const err = errors.map(e => {
                const error = e.constraints;
                const property = e.property;
                return { property, error };
            });
            return res.send(err).status(400);
        }

        if (deviceExist) {
            try {
                const updateResult: UpdateResult = await repo.createQueryBuilder("device")
                    .update(Device, device)
                    .where("device_key = :device_key", { device_key: device_key })
                    .returning(["device_key", "device_name", "device_type"])
                    .execute();

                // if (updateResult.raw.length > 0) {
                return res.sendInsertOK({
                    action: "delete device pairing",
                    data: {
                        ...updateResult.raw[0],
                    }
                });

            } catch (error) {
                console.log(error);
                return res.sendError(error);
            }

        } else {
            return res.sendError({ message: `device with uuid: "${device_key}" not found` });

        }

    }
}

const pairing = new PairingController();
export default pairing;