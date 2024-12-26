export type Grade = "O" | "E" | "A" | "B" | "C" | "D" | "F" | "M" | "S";

export const gradePoints: Record<Grade, number> = {
  O: 10,
  E: 9,
  A: 8,
  B: 7,
  C: 6,
  D: 5,
  F: 2,
  M: 0,
  S: 0,
};

export interface Course {
  name: string;
  credits: number;
  grade: Grade;
}

export interface Semester {
  courses: Course[];
  sgpa?: number;
  totalCredits?: number;
}

export function calculateSGPA(courses: Course[]): number {
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
  const totalPoints = courses.reduce(
    (sum, course) => sum + course.credits * gradePoints[course.grade],
    0
  );
  return totalPoints / totalCredits;
}

export function calculateCGPA(semesters: Semester[]): number {
  const totalCredits = semesters.reduce((sum, semester) => {
    return (
      sum +
      (semester.totalCredits ||
        semester.courses.reduce((semSum, course) => semSum + course.credits, 0))
    );
  }, 0);

  const totalPoints = semesters.reduce((sum, semester) => {
    if (semester.sgpa && semester.totalCredits) {
      return sum + semester.sgpa * semester.totalCredits;
    }
    return (
      sum +
      calculateSGPA(semester.courses) *
        semester.courses.reduce((semSum, course) => semSum + course.credits, 0)
    );
  }, 0);

  return totalPoints / totalCredits;
}

export const defaultPresetCredits: number[] = [
  20.5, 20.5, 23, 20.5, 22.5, 20, 20,
];
