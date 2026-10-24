import { z } from "zod";

const name = z.string().trim().min(2, "Escribe al menos 2 caracteres.").max(60, "Máximo 60 caracteres.")
  .regex(/^[\p{L}\p{M} '\-]+$/u, "Usa letras, espacios, apóstrofes o guiones.");
export const personSchema = z.object({
  firstName: name,
  lastName: name,
  email: z.string().trim().toLowerCase().max(120).email("Escribe un correo válido.")
    .refine((value) => value.endsWith("@example.com"), "Usa un correo ficticio terminado en @example.com."),
  phone: z.string().trim().transform((value) => value.replace(/[\s-]/g, ""))
    .refine((value) => value === "" || /^000\d{6}$/.test(value), "Usa 9 dígitos que empiecen con 000, o deja el campo vacío."),
  demoAcknowledged: z.literal(true, { error: "Confirma que estás usando datos ficticios." }),
}).strict();
export type Person = { id: string; firstName: string; lastName: string; email: string; phone: string | null; createdAt: string };
export type PersonInput = z.input<typeof personSchema>;
export const examplePeople: PersonInput[] = [
  { firstName: "Lucía", lastName: "Torres", email: "lucia.torres@example.com", phone: "000000101", demoAcknowledged: true },
  { firstName: "Mateo", lastName: "Rivas", email: "mateo.rivas@example.com", phone: "000000102", demoAcknowledged: true },
  { firstName: "Valentina", lastName: "Salas", email: "valentina.salas@example.com", phone: "", demoAcknowledged: true },
  { firstName: "Diego", lastName: "Vega", email: "diego.vega@example.com", phone: "000000104", demoAcknowledged: true },
];
