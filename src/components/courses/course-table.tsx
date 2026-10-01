import { Badge } from "@/components/ui/badge";
import { ConfirmDeleteButton } from "@/components/confirm-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEnrollmentStore } from "@/lib/enrollment-store";

export function CourseTable() {
  const courses = useEnrollmentStore((s) => s.courses);
  const removeCourse = useEnrollmentStore((s) => s.removeCourse);

  console.log("courses: ", courses);
  

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>รหัสวิชา</TableHead>
            <TableHead>ชื่อวิชา</TableHead>
            <TableHead>หลักสูตร</TableHead>
            <TableHead>ภาคการศึกษา</TableHead>
            <TableHead>รายละเอียด</TableHead>
            <TableHead>ผู้สอน</TableHead>
            <TableHead>รับข่าวสารทางอีเมล</TableHead>
            <TableHead className="w-20 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="h-20 text-center text-muted-foreground"
              >
                ยังไม่มีข้อมูลวิชาเรียน
              </TableCell>
            </TableRow>
          )}
          {courses.map((course) => (
            <TableRow key={course.courseId}>
              <TableCell className="font-medium">{course.courseId}</TableCell>
              <TableCell>{course.courseTitle}</TableCell>
              <TableCell>
                {course.program ? (
                  <Badge variant="outline" className="rounded-full">
                    {course.program}
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                {course.semester === "1"
                  ? "ภาคการศึกษาที่ 1"
                  : course.semester === "2"
                  ? "ภาคการศึกษาที่ 2"
                  : course.semester === "3"
                  ? "ภาคฤดูร้อน"
                  : "-"}
              </TableCell>
              <TableCell
                className="max-w-[200px] whitespace-normal text-muted-foreground"
                title={course.description}
              >
                {course.description || "-"}
              </TableCell>
              <TableCell>
                {course.instructors.length === 0 ? (
                  <span className="text-muted-foreground">-</span>
                ) : (
                  <div className="flex flex-col gap-2">
                    {course.instructors.map((inst, idx) => (
                      <div key={idx} className="flex flex-col">
                        <span className="text-sm font-medium">{inst.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {inst.email}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </TableCell>
              <TableCell>
                {course.notifyByEmail ? (
                  <Badge>
                    รับ
                  </Badge>
                ) : (
                  <Badge variant="secondary">ไม่รับ</Badge>
                )}
              </TableCell>
              <TableCell className="text-center">
                <ConfirmDeleteButton
                  label={`ลบ ${course.courseId}`}
                  title="ยืนยันการลบวิชา?"
                  description={`คุณต้องการลบวิชา ${course.courseId} ${course.courseTitle} ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`}
                  onConfirm={() => removeCourse(course.courseId)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}