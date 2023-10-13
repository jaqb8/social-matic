import * as z from "zod";

export const PlatformEnum = z.enum(["TWITTER", "LINKEDIN"]);

export type PlatformEnum = z.infer<typeof PlatformEnum>;
