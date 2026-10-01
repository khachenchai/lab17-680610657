import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RotateCcw, PlusCircle, X } from "lucide-react";
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
  type DefaultValues,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { useEnrollmentStore } from "@/lib/enrollment-store";
import {
  createCourseFormSchema,
  MAX_DESCRIPTION_LENGTH,
  MAX_COURSE_INSTRUCTORS,
  type CourseFormInput,
  type CourseFormValues,
} from "@/lib/schemas/course-schema";

const emptyCourseForm: DefaultValues<CourseFormInput> = {
  courseId: "",
  courseTitle: "",
  program: undefined,
  semester: undefined,
  description: "",
  instructors: [{ name: "", email: "" }],
  notifyByEmail: false,
};

export function AddNewCourseDialog() {
  const addCourse = useEnrollmentStore((s) => s.addCourse);
  const courses = useEnrollmentStore((s) => s.courses);

  const [open, setOpen] = useState(false);

  const schema = useMemo(() => createCourseFormSchema(courses), [courses]);

  const form = useForm<CourseFormInput, unknown, CourseFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyCourseForm,
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "instructors",
  });

  const instructorsError =
    form.formState.errors.instructors?.root ?? form.formState.errors.instructors;

  const resetForm = () => form.reset(emptyCourseForm);

  function onSubmit(values: CourseFormValues) {
    console.log(values);
    
    addCourse(values);
    resetForm();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <DialogTrigger render={<Button />}>
        <PlusCircle className="h-4 w-4 mr-2" /> เพิ่มวิชา
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="grid gap-4"
        >
          <DialogHeader>
            <DialogTitle>เพิ่มวิชาใหม่</DialogTitle>
            <DialogDescription>
              ลองใส่รหัสวิชาไม่ครบ 6 หลัก ใส่รหัสที่มีอยู่แล้ว ใส่อีเมลผู้สอนที่ไม่ใช่ @cmu.ac.th หรือพิมพ์รายละเอียดเกิน 100 ตัวอักษร แล้วกดบันทึก
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
            <Controller
              name="courseId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="courseId">รหัสวิชา</FieldLabel>
                  <Input
                    {...field}
                    id="courseId"
                    placeholder="261305"
                    inputMode="numeric"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="courseTitle"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="courseTitle">ชื่อวิชา</FieldLabel>
                  <Input
                    {...field}
                    id="courseTitle"
                    placeholder="Mobile Application Development"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <Controller
            name="program"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="program">หลักสูตร</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value ?? null}
                  onValueChange={(v) => {
                    field.onChange(v);
                    field.onBlur();
                  }}
                >
                  <SelectTrigger
                    id="program"
                    className="w-full"
                    aria-invalid={fieldState.invalid}
                    ref={field.ref}
                  >
                    <SelectValue placeholder="เลือกหลักสูตร" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CPE">
                      CPE - วิศวกรรมคอมพิวเตอร์
                    </SelectItem>
                    <SelectItem value="ISNE">
                      ISNE - วิศวกรรมระบบสารสนเทศและเครือข่าย
                    </SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="semester"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet data-invalid={fieldState.invalid}>
                <FieldLegend variant="label" >ภาคการศึกษา</FieldLegend>
                <RadioGroup
                  value={field.value ?? ""}
                  onValueChange={(v) => {
                    field.onChange(v);
                    field.onBlur();
                  }}
                  className="flex flex-row gap-4"
                >
                  <Field orientation="horizontal" className="w-fit" data-invalid={fieldState.invalid}>
                    <RadioGroupItem value="1" id="sem-1" aria-invalid={fieldState.invalid} />
                    <FieldLabel htmlFor="sem-1" className="font-normal">
                      ภาคการศึกษาที่ 1
                    </FieldLabel>
                  </Field>
                  <Field orientation="horizontal" className="w-fit" data-invalid={fieldState.invalid}>
                    <RadioGroupItem value="2" id="sem-2" aria-invalid={fieldState.invalid} />
                    <FieldLabel htmlFor="sem-2" className="font-normal">
                      ภาคการศึกษาที่ 2
                    </FieldLabel>
                  </Field>
                  <Field orientation="horizontal" className="w-fit" data-invalid={fieldState.invalid}>
                    <RadioGroupItem value="3" id="sem-3" aria-invalid={fieldState.invalid} />
                    <FieldLabel htmlFor="sem-3" className="font-normal">
                      ภาคฤดูร้อน
                    </FieldLabel>
                  </Field>
                </RadioGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldSet>
            )}
          />

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => {
              const descValue =
                useWatch({ control: form.control, name: "description" }) || "";
              const isOverLimit = descValue.length > MAX_DESCRIPTION_LENGTH;

              return (
                <Field data-invalid={fieldState.invalid || isOverLimit}>
                  <FieldLabel htmlFor="description">
                    รายละเอียด (ไม่บังคับ)
                  </FieldLabel>
                  <Textarea
                    id="description"
                    {...field}
                    placeholder="พัฒนาแอปพลิเคชันบนอุปกรณ์เคลื่อนที่ด้วย React Native"
                    aria-invalid={fieldState.invalid || isOverLimit}
                  />
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-xs ${isOverLimit
                          ? "text-destructive"
                          : "text-muted-foreground"
                        }`}
                    >
                      {descValue.length}/{MAX_DESCRIPTION_LENGTH} ตัวอักษร
                    </span>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />

          <FieldSet data-invalid={!!instructorsError?.message}>
            <FieldLegend variant="label">ผู้สอน</FieldLegend>
            <FieldDescription>
              {fields.length}/{MAX_COURSE_INSTRUCTORS} คน — กรอกชื่อผู้สอน
              และอีเมล name@cmu.ac.th (ห้ามซ้ำกัน)
            </FieldDescription>
            <FieldGroup className="gap-3">
              {fields.map((item, index) => (
                <div key={item.id} className="flex items-start gap-2">
                  <span className="mt-1.5 w-5 shrink-0 text-sm text-muted-foreground">
                    {index + 1}.
                  </span>
                  <div className="grid flex-1 gap-4 sm:grid-cols-2">
                    <Controller
                      name={`instructors.${index}.name`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldContent>
                            <Input
                              {...field}
                              placeholder="กรอกชื่อผู้สอน"
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </FieldContent>
                        </Field>
                      )}
                    />
                    <Controller
                      name={`instructors.${index}.email`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldContent>
                            <Input
                              {...field}
                              type="email"
                              placeholder="ต้องเป็นอีเมล @cmu.ac.th"
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </FieldContent>
                        </Field>
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={fields.length <= 1}
                    onClick={() => remove(index)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
            </FieldGroup>
            {instructorsError?.message && (
              <FieldError errors={[instructorsError]} />
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit"
              disabled={fields.length >= MAX_COURSE_INSTRUCTORS}
              onClick={() => append({ name: "", email: "" })}
            >
              <Plus className="size-4 mr-2" /> เพิ่มผู้สอน
            </Button>
          </FieldSet>

          <Controller
            name="notifyByEmail"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                orientation="horizontal"
                className="items-center justify-between rounded-lg border p-4"
                data-invalid={fieldState.invalid}
              >
                <div className="space-y-0.5">
                  <FieldLabel className="text-base">
                    รับข่าวสารทางอีเมล
                  </FieldLabel>
                  <FieldDescription>
                    แจ้งเตือนผู้สอนเมื่อเปิดลงทะเบียน
                  </FieldDescription>
                </div>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    field.onBlur();
                  }}
                />
              </Field>
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetForm}>
              <RotateCcw className="h-4 w-4 mr-2" /> ล้างฟอร์ม
            </Button>
            <Button type="submit">บันทึก</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}