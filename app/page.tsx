"use client";

import { useState } from "react";
import {
  Grade,
  Course,
  Semester,
  calculateSGPA,
  calculateCGPA,
  gradePoints,
  defaultPresetCredits,
} from "@/utils/gradeCalculations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function CGPACalculator() {
  const [semesters, setSemesters] = useState<Semester[]>([
    { courses: [{ name: "", credits: 0, grade: "O" }] },
  ]);
  const [cgpa, setCGPA] = useState<number | null>(null);
  const [presetModes, setPresetModes] = useState<boolean[]>([false]);

  const addSemester = () => {
    setSemesters([
      ...semesters,
      { courses: [{ name: "", credits: 0, grade: "O" }] },
    ]);
    setPresetModes([...presetModes, false]);
  };

  const addCourse = (semesterIndex: number) => {
    const newSemesters = [...semesters];
    newSemesters[semesterIndex].courses.push({
      name: "",
      credits: 0,
      grade: "O",
    });
    setSemesters(newSemesters);
  };

  const updateCourse = (
    semesterIndex: number,
    courseIndex: number,
    field: keyof Course,
    value: string | number
  ) => {
    const newSemesters = [...semesters];
    newSemesters[semesterIndex].courses[courseIndex][field] = value as never;
    setSemesters(newSemesters);
  };

  const updateSemester = (
    semesterIndex: number,
    field: "sgpa" | "totalCredits",
    value: number
  ) => {
    const newSemesters = [...semesters];
    newSemesters[semesterIndex][field] = value;
    setSemesters(newSemesters);
  };

  const toggleSGPAInput = (semesterIndex: number) => {
    const newSemesters = [...semesters];
    const newPresetModes = [...presetModes];
    if (newSemesters[semesterIndex].sgpa !== undefined) {
      delete newSemesters[semesterIndex].sgpa;
      delete newSemesters[semesterIndex].totalCredits;
    } else {
      newSemesters[semesterIndex].sgpa = 0;
      newSemesters[semesterIndex].totalCredits =
        defaultPresetCredits[semesterIndex] || 20;
      newPresetModes[semesterIndex] = false;
    }
    setSemesters(newSemesters);
    setPresetModes(newPresetModes);
  };

  const togglePreset = (semesterIndex: number) => {
    const newSemesters = [...semesters];
    const newPresetModes = [...presetModes];
    newPresetModes[semesterIndex] = !newPresetModes[semesterIndex];
    if (newPresetModes[semesterIndex]) {
      newSemesters[semesterIndex] = {
        courses: [],
        sgpa: 0,
        totalCredits: defaultPresetCredits[semesterIndex] || 20,
      };
    } else {
      newSemesters[semesterIndex] = {
        courses: [{ name: "", credits: 0, grade: "O" }],
      };
    }
    setSemesters(newSemesters);
    setPresetModes(newPresetModes);
  };

  const calculateResults = () => {
    const calculatedCGPA = calculateCGPA(semesters);
    setCGPA(calculatedCGPA);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">CGPA Calculator</h1>
      {semesters.map((semester, semesterIndex) => (
        <Card key={semesterIndex} className="mb-4">
          <CardHeader>
            <CardTitle>Semester {semesterIndex + 1}</CardTitle>
            <CardDescription>
              Enter course details, SGPA, or use preset
            </CardDescription>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id={`sgpa-toggle-${semesterIndex}`}
                  checked={semester.sgpa !== undefined}
                  onCheckedChange={() => toggleSGPAInput(semesterIndex)}
                  disabled={presetModes[semesterIndex]}
                />
                <Label htmlFor={`sgpa-toggle-${semesterIndex}`}>
                  I know my SGPA
                </Label>
              </div>
              {/* {<div className="flex items-center space-x-2">
                <Switch
                  id={`preset-toggle-${semesterIndex}`}
                  checked={presetModes[semesterIndex]}
                  onCheckedChange={() => togglePreset(semesterIndex)}
                />
                <Label htmlFor={`preset-toggle-${semesterIndex}`}>
                  Use Preset
                </Label>
              </div>} */}
            </div>
          </CardHeader>
          <CardContent>
            {presetModes[semesterIndex] ? (
              <div className="flex space-x-2 mb-2">
                <Input
                  type="number"
                  placeholder="SGPA"
                  value={semester.sgpa || ""}
                  onChange={(e) =>
                    updateSemester(
                      semesterIndex,
                      "sgpa",
                      Number(e.target.value)
                    )
                  }
                  className="w-1/2"
                />
                <Input
                  type="number"
                  placeholder="Total Credits"
                  value={semester.totalCredits || ""}
                  onChange={(e) =>
                    updateSemester(
                      semesterIndex,
                      "totalCredits",
                      Number(e.target.value)
                    )
                  }
                  className="w-1/2"
                />
              </div>
            ) : semester.sgpa !== undefined ? (
              <div className="flex space-x-2 mb-2">
                <Input
                  type="number"
                  placeholder="SGPA"
                  value={semester.sgpa || ""}
                  onChange={(e) =>
                    updateSemester(
                      semesterIndex,
                      "sgpa",
                      Number(e.target.value)
                    )
                  }
                  className="w-1/2"
                />
                <Input
                  type="number"
                  placeholder="Total Credits"
                  value={semester.totalCredits || ""}
                  onChange={(e) =>
                    updateSemester(
                      semesterIndex,
                      "totalCredits",
                      Number(e.target.value)
                    )
                  }
                  className="w-1/2"
                />
              </div>
            ) : (
              semester.courses.map((course, courseIndex) => (
                <div key={courseIndex} className="flex space-x-2 mb-2">
                  <Input
                    placeholder="Course Name"
                    value={course.name}
                    onChange={(e) =>
                      updateCourse(
                        semesterIndex,
                        courseIndex,
                        "name",
                        e.target.value
                      )
                    }
                    className="flex-grow"
                  />
                  <Input
                    type="number"
                    placeholder="Credits"
                    value={course.credits || ""}
                    onChange={(e) =>
                      updateCourse(
                        semesterIndex,
                        courseIndex,
                        "credits",
                        Number(e.target.value)
                      )
                    }
                    className="w-20"
                  />
                  <Select
                    value={course.grade}
                    onValueChange={(value: Grade) =>
                      updateCourse(semesterIndex, courseIndex, "grade", value)
                    }
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(gradePoints).map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {!presetModes[semesterIndex] && semester.sgpa === undefined && (
              <Button onClick={() => addCourse(semesterIndex)}>
                Add Course
              </Button>
            )}
            <div className="text-right">
              {!presetModes[semesterIndex] && semester.sgpa === undefined && (
                <p>SGPA: {calculateSGPA(semester.courses).toFixed(2)}</p>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
      <Button onClick={addSemester} className="mb-4 mr-4">
        Add Semester
      </Button>
      <Button onClick={calculateResults} className="mb-4">
        Calculate CGPA
      </Button>
      {cgpa !== null && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">CGPA: {cgpa.toFixed(2)}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
