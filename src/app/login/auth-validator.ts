import z from "zod";

export const AuthValidator = z.object({
    email: z.string().email(),
    password: z.string().min(6)

});
