let studentName = document.getElementById("studentName");
let courseName = document.getElementById("courseName");

let addStudent = document.getElementById("addStudent");
let addCourse = document.getElementById("addCourse");

let studentSelect = document.getElementById("studentSelect");
let courseSelect = document.getElementById("courseSelect");

let enroll = document.getElementById("enroll");
let removeEnrollment = document.getElementById("removeEnrollment");

let search = document.getElementById("search");
let studentTable = document.getElementById("studentTable");

let students = new Map();
let courses = new Map();


// add student

addStudent.onclick = function () {

    let name = studentName.value.trim();

    if (!name) {
        showMessage("Please enter student name", "error");
        return;
    }

    let studentExists = Array.from(students.values()).some(
        student => student.name.toLowerCase() === name.toLowerCase()
    );

    if (studentExists) {
        showMessage("Student already exists", "error");
        return;
    }

    let id = students.size + 1;

    let student = {
        id: id,
        name: name,
        courses: new Set()
    };

    students.set(id, student);

    studentName.value = "";

    updateStudentSelect();
    showData();

    showMessage("Student added successfully", "success");
};


// add course

addCourse.onclick = function () {

    let name = courseName.value.trim();

    if (!name) {
        showMessage("Please enter course name", "error");
        return;
    }

    let courseExists = Array.from(courses.values()).some(
        course => course.name.toLowerCase() === name.toLowerCase()
    );

    if (courseExists) {
        showMessage("Course already exists", "error");
        return;
    }

    let id = courses.size + 1;

    let course = {
        id: id,
        name: name
    };

    courses.set(id, course);

    courseName.value = "";

    updateCourseSelect();

    showMessage("Course added successfully", "success");
};


// enroll student

enroll.onclick = function () {

    let studentId = studentSelect.value;
    let courseId = courseSelect.value;

    if (!studentId || !courseId) {
        showMessage("Please select student and course", "error");
        return;
    }

    let student = students.get(Number(studentId));
    let course = courses.get(Number(courseId));

    if (!student || !course) {
        showMessage("Invalid student or course", "error");
        return;
    }

    if (student.courses.has(course.id)) {
        showMessage("Student is already enrolled in this course", "error");
        return;
    }

    student.courses.add(course.id);

    showData();

    showMessage("Student enrolled successfully", "success");
};


// remove enrollment

removeEnrollment.onclick = function () {

    let studentId = studentSelect.value;
    let courseId = courseSelect.value;

    if (!studentId || !courseId) {
        showMessage("Please select student and course", "error");
        return;
    }

    let student = students.get(Number(studentId));

    if (!student) {
        showMessage("Student not found", "error");
        return;
    }

    if (!student.courses.has(Number(courseId))) {
        showMessage("Student is not enrolled in this course", "error");
        return;
    }

    student.courses.delete(Number(courseId));

    showData();

    showMessage("Course removed successfully", "success");
};


// update student select

function updateStudentSelect() {

    studentSelect.innerHTML = `
        <option value="">Select Student</option>
    `;

    students.forEach(({ id, name }) => {

        studentSelect.innerHTML += `
            <option value="${id}">
                ${name}
            </option>
        `;

    });
}


// update course select

function updateCourseSelect() {

    courseSelect.innerHTML = `
        <option value="">Select Course</option>
    `;

    courses.forEach(({ id, name }) => {

        courseSelect.innerHTML += `
            <option value="${id}">
                ${name}
            </option>
        `;

    });
}


// display students

function showData() {

    if (students.size === 0) {

        studentTable.innerHTML = `
            <tr>
                <td colspan="4"
                    class="text-center py-8 text-gray-500">
                    No students added yet
                </td>
            </tr>
        `;

        return;
    }

    let table = "";

    students.forEach(({ id, name, courses: studentCourses }) => {

        let coursesList = Array.from(studentCourses);

        let courseNames = coursesList.map(courseId => {
            return courses.get(courseId)?.name;
        });

        table += `
            <tr class="border-b hover:bg-pink-50 transition">

                <td class="px-4 py-3">
                    ${id}
                </td>

                <td class="px-4 py-3 font-bold">
                    ${name}
                </td>

                <td class="px-4 py-3">

                    ${
                        courseNames.length > 0
                            ? courseNames.join(", ")
                            : "No courses"
                    }

                </td>

                <td class="px-4 py-3">

                    <button
                        onclick="selectStudent(${id})"
                        class="bg-pink-500 hover:bg-pink-600
                               text-white px-3 py-1 rounded-md">
                        Select
                    </button>

                </td>

            </tr>
        `;
    });

    studentTable.innerHTML = table;
}


// select student

function selectStudent(id) {

    studentSelect.value = id;

}


// search student

search.onkeyup = function () {

    let value = search.value.trim().toLowerCase();

    if (value === "") {
        showData();
        return;
    }

    let found = false;

    let table = "";

    students.forEach(({ id, name, courses: studentCourses }) => {

        if (name.toLowerCase().includes(value)) {

            found = true;

            let courseNames = Array.from(studentCourses).map(
                courseId => courses.get(courseId)?.name
            );

            table += `
                <tr class="border-b hover:bg-pink-50 transition">

                    <td class="px-4 py-3">
                        ${id}
                    </td>

                    <td class="px-4 py-3 font-bold">
                        ${name}
                    </td>

                    <td class="px-4 py-3">
                        ${
                            courseNames.length > 0
                                ? courseNames.join(", ")
                                : "No courses"
                        }
                    </td>

                    <td class="px-4 py-3">
                        <button
                            onclick="selectStudent(${id})"
                            class="bg-pink-500 hover:bg-pink-600
                                   text-white px-3 py-1 rounded-md">
                            Select
                        </button>
                    </td>

                </tr>
            `;
        }
    });

    if (found) {

        studentTable.innerHTML = table;

    } else {

        studentTable.innerHTML = `
            <tr>
                <td colspan="4"
                    class="text-center py-8 text-red-500 font-bold">
                    Student not found
                </td>
            </tr>
        `;
    }
};



function validateStudents() {

    let studentData = Array.from(students.values());

    return studentData.every(({ name }) => name.trim() !== "");

}



function showMessage(message, type) {

    let oldMessage = document.getElementById("message");

    if (oldMessage) {
        oldMessage.remove();
    }

    let messageElement = document.createElement("div");

    messageElement.id = "message";

    messageElement.className =
        type === "success"
            ? "bg-green-100 text-green-700 p-3 rounded-md mb-4 font-bold"
            : "bg-red-100 text-red-700 p-3 rounded-md mb-4 font-bold";

    messageElement.textContent = message;

    document.querySelector("main").prepend(messageElement);

    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}


showData();