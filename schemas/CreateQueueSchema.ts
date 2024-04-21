import { z } from "zod";

export const CreateQueueFormSchema = z.object({
    name: z.string().nonempty({ message: 'name cannot be empty!'})
})