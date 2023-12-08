import z from "zod";

export const UserRegValidator = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6)

}).superRefine(({confirmPassword, password}, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: "custom",
            path: ['confirmPassword'],
            message: "The passwords did not match"
        });
    }
});
