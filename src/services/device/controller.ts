import { Request, Response } from "express";
import { Services } from "../base_services";
import { getRepository, UpdateResult, DeleteResult } from "typeorm";
import { validate } from "class-validator";
import { Device } from "./entity";

class DeviceController extends Services {
    public show = async (req: Request, res: Response) => {
        const device = await getRepository(Device).createQueryBuilder('device')
            .leftJoin('device.pairedTo', 'user')
            .where({ device_key: req.params.device_key })
            .addSelect(['user.name'])
            .getOne();

        if (!device) {
            return res.sendNotFound(`device with uuid: ${req.params.device_key} not found`);
        }

        return res.sendOK({ action: "get device", data: device });
    };

    public create = async (req: Request, res: Response) => {
        const repo = await getRepository(Device);

        // check berdasarkan device_key apakah sudah terdaftar atau belum
        const deviceExist = await repo.createQueryBuilder("device")
            .where({ device_key: req.body.device_key })
            .select(["device.id", "device.device_key", "device.device_ip", "device.firmware_version"])
            .getOne();

        const device = new Device();
        device.device_key = req.body.device_key;
        device.device_ip = req.body.device_ip;
        device.firmware_version = req.body.firmware_version;

        const errors = await validate(device);
        // console.log({ errornya_adalah: errors });

        if (errors.length > 0) {
            const err = errors.map(e => {
                const error = e.constraints;
                const property = e.property;
                return { property, error };
            });
            return res.sendError(err);
        }

        // check if device exist
        if (!deviceExist) {

            // Save the repo
            await repo.save(device)
                .then((device: Device) => {
                    return res.sendOK({ action: "create device", data: device });
                })
                .catch((errors) => {
                    console.log(errors);
                    return res.sendInsertError(errors);
                });

        } else {

            if (deviceExist.device_ip != req.body.device_ip || deviceExist.firmware_version != req.body.firmware_version) {
                device.id = deviceExist.id;
                // Update the device
                try {
                    const updateResult: UpdateResult = await repo.createQueryBuilder("device")
                        .update(Device, device)
                        .whereEntity(device)
                        .returning(["id", "device_key", "device_ip", "firmware_version"])
                        .execute();

                    return res.sendOK({ action: "update device", data: updateResult.generatedMaps[0] });

                } catch (error) {
                    console.log(error);
                    return res.sendInternalError();
                }

            } else if (deviceExist.device_ip == req.body.device_ip || deviceExist.firmware_version == req.body.firmware_version) {
                return res.sendNotModified({ action: "update device", data: deviceExist });
            }
        }
    };

    public destroy = async (req: Request, res: Response) => {
        const device_key = req.params.device_key;
        const repo = await getRepository(Device);

        try {
            const delDevice = await repo.createQueryBuilder("device")
                .delete()
                .from(Device)
                .where("device_key = :device_key", { device_key: device_key })
                .execute();

            if (delDevice.affected) {
                res.sendOK({ action: "delete device", data: `device with uuid: ${device_key} deleted` });
            } else {
                res.sendError(`device with uuid: ${device_key} not found`);
            }

        } catch (error) {
            return res.sendInternalError();
        }

    }
}

const device = new DeviceController();
export default device;