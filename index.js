// ES6+

class Student {
  constructor(name, enrolled = false) {
    this.name = name;
    this.enrolled = enrolled;
  }

  notify(message, callback) {
    console.log(message);

    callback();
  }

  // getter, not a function
  get status() {
    return `${this.name} is enrolled: ${this.enrolled}`;
  }

  // function, delays progress and then executes callback
  // there is only one thread, so the callback is executed through an event
  isEnrolledSlow(delay, callback) {
    setTimeout(() => {
      if (this.enrolled) {
        callback("Already enrolled", null);
      } else {
        callback(null, this);
      }
    }, delay);
  }
}

// creates an array of students
const students = Array();

let fred = new Student("Fred");

// adds 4 new students to the array
students.push(
  new Student("Austin"),
  new Student("Bravo"),
  new Student("Charlie"),
  new Student("Delta")
);

// using two parameters is a good way to check if a function worked or not
// used mainly in callbacks
function f(err, result) {
  if (err) {
    console.log("ERROR!", err);
  } else {
    console.log(result.status);
  }
}

fred.isEnrolledSlow(1000, (err, result) => {
  if (err) {
    console.log("ERROR!", err);
  } else {
    console.log(result);
  }
});

class Course {
  constructor(name = "CS0000", enrolled = 0, capacity = 25, seats, instructor) {
    this.name = name;
    this.enrolled = enrolled;
    this.capacity = capacity;
    this.seats = seats;
    this.instructor = instructor;
  }

  toString() {
    return `${this.name} Enrolled: ${this.enrolled} Capacity: ${
      this.callback
    } Seats: ${this.seats} Instructor: ${this.instructor}`;
  }

  // simulates a call to a database to see if there is checkSpace
  // callback has two parameters:
  // first is the error parameter
  // second is the
  checkSpaceSlow(delay, callback) {
    setTimeout(() => {
      if (this.enrolled <= this.capacity) {
        callback(null, this);
      } else {
        callback("Not enough space!", this);
      }
    }, delay);
  }
}

const course1 = new Course("CS2114", 100, 105, "0001", "Esakia", students);

console.log(course1.toString());

const course2 = {
  name: "CS2104",
  enrolled: 51,
  capacity: 52,
  seats: 55,
  instructor: "Esakia",
  toString: function() {
    return `${this.name} Enrolled: ${this.enrolled} Capacity: ${
      this.callback
    } Seats: ${this.seats} Instructor: ${this.instructor}`;
  },
  checkSpaceSlow(delay, callback) {
    setTimeout(() => {
      if (this.enrolled <= this.capacity) {
        callback(null, this);
      } else {
        callback("Not enough space!", this);
      }
    }, delay);
  }
};

const course3 = Object.assign(Object.create(Course.prototype), {
  name: "CS2304",
  enrolled: 49,
  capacity: 57,
  seats: 60,
  instructor: "Esakia",
  toString: function() {
    return `${this.name} Enrolled: ${this.enrolled} Capacity: ${
      this.callback
    } Seats: ${this.seats} Instructor: ${this.instructor}`;
  },
  checkSpaceSlow(delay, callback) {
    setTimeout(() => {
      if (this.enrolled <= this.capacity) {
        callback(null, this);
      } else {
        callback("Not enough space!", null);
      }
    }, delay);
  }
});

let courses = new Array();

function addToCourseArray(courses, course) {
  if (course instanceof Course) {
    courses.push(course);
    console.log("Course Added!");
  } else {
    console.log("wrong type!");
  }
}

addToCourseArray(courses, course1);
addToCourseArray(courses, course2);
addToCourseArray(courses, course3);

// enrolled --> checkSpaceSlow --> enroll & notify --> increment --> print a message

function slowIncrement(delay, course, callback) {
  setTimeout(() => {
    course.enrolled++;
    if (course.capacity === course.enrolled) {
      callback(course.name + " is full!", null);
    } else {
      callback(
        null,
        course.name + " has " + (course.capacity - course.enrolled) + " seats."
      );
    }
  }, delay);
}

function slowAddStudent(delay, student, course, callback) {
  student.isEnrolledSlow(delay, (err, student) => {
    if (err) {
      callback(err);
    } else if (!course) {
      callback("Course is null!");
    } else {
      course.checkSpaceSlow(delay, (err, course) => {
        if (err) {
          callback(err);
        }
        student.enrolled = true;
        student.notify("You are enrolled in " + course.name, () => {
          slowIncrement(delay, course, (full, available) => {
            if (full) {
              callback(full);
            } else {
              callback(available);
            }
          });
        });
      });
    }
  });
}

slowAddStudent(1000, fred, course1, output => {
  console.log(output);
});
