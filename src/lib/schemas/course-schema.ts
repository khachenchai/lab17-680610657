import { z } from "zod";
import type { Course } from "@/lib/types";

export const MAX_COURSE_INSTRUCTORS = 3;
export const MAX_DESCRIPTION_LENGTH = 100;

export const courseFormSchema = z.object({
    courseId: z
        .string()
        .trim()
        .regex(/^\d{6}$/, "รหัสวิชาต้องเป็นตัวเลข 6 หลัก"),
    courseTitle: z
        .string()
        .trim()
        .min(1, "กรอกชื่อวิชา")
        .max(100, "ชื่อวิชายาวได้ไม่เกิน 100 ตัวอักษร"),
    program: z.enum(["CPE", "ISNE"], {
        message: "เลือกหลักสูตร",
    }),
    semester: z.enum(["1", "2", "3"], {
        message: "เลือกภาคการศึกษา",
    }),
    description: z
        .string()
        .max(
            MAX_DESCRIPTION_LENGTH,
            `รายละเอียดยาวได้ไม่เกิน ${MAX_DESCRIPTION_LENGTH} ตัวอักษร`
        )
        .optional(),
    instructors: z
        .array(
            z.object({
                name: z.string().trim().min(1, "กรอกชื่อผู้สอน"),
                email: z
                    .string()
                    .trim()
                    .email("อีเมลไม่ถูกต้อง")
                    .regex(/@cmu\.ac\.th$/, "ต้องเป็นอีเมล @cmu.ac.th"),
            })
        )
        .min(1, "ต้องมีผู้สอนอย่างน้อย 1 คน")
        .max(
            MAX_COURSE_INSTRUCTORS,
            `ผู้สอนมีได้ไม่เกิน ${MAX_COURSE_INSTRUCTORS} คน`
        )
        .refine(
            (items) => {
                // เช็คว่าอีเมลใน Array ของผู้สอนห้ามซ้ำกัน
                const emails = items.map((i) => i.email.toLowerCase());
                return new Set(emails).size === emails.length;
            },
            { message: "อีเมลผู้สอนซ้ำกัน" }
        ),
    notifyByEmail: z.boolean().default(false),
});

export type CourseFormInput = z.input<typeof courseFormSchema>;
export type CourseFormValues = z.output<typeof courseFormSchema>;

export function createCourseFormSchema(existingCourses: Course[]) {
    return courseFormSchema.extend({
        courseId: z
            .string()
            .trim()
            .regex(/^\d{6}$/, "รหัสวิชาต้องเป็นตัวเลข 6 หลัก")
            .refine(
                (id) => !existingCourses.some((c) => c.courseId === id),
                "รหัสวิชานี้มีอยู่แล้ว"
            ),
    });
}