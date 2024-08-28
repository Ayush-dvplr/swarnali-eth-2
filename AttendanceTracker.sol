// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

// Creating a simple contract of AttendanceTracker that keeps track when a student is marked present or absent
contract AttendanceTracker {
    address public teacher; // The address of the teacher is the variable storing the address of the contract creator
    mapping(address => bool) private  attendance;
    address[] private  studentList; // List of all students who have had their attendance marked

    // Events
    event AttendanceMarked(address indexed student, bool present);
    event StudentAdded(address indexed student);

    constructor() {
        teacher = msg.sender;
    }

    function markAttendance(address _student) public {
        // Only the teacher can mark attendance
        require(msg.sender == teacher, "Only the teacher can mark attendance");

        // check is student already marked present
        assert(attendance[_student]!=true);

        // Mark the student as present
        attendance[_student] = true;

        // Add the student to the studentList if not already present
        if (!isStudentInList(_student)) {
            studentList.push(_student);
            emit StudentAdded(_student); // Emit event when a student is added
        }


        

        // Emit event when attendance is marked
        emit AttendanceMarked(_student, true);
        
    }

    function unmarkAttendance(address _student) public {
        // Only the teacher can unmark attendance
        require(msg.sender == teacher, "Only the teacher can unmark attendance");

        // Check if the student is already marked as present and if not reverts with the following message 
        if (!attendance[_student]) {
            revert("Student is not marked as present");
        }

        // Unmark the student as present
        attendance[_student] = false;

        // Emit event when attendance is unmarked
        emit AttendanceMarked(_student, false);

        // Assert that the student is now marked as absent
        assert(attendance[_student] == false);
    }

    // Method to check if a student is marked as present or not
    function isMarkedPresent(address _student) public view returns (bool) {
        return attendance[_student];
    }

    // Method to get all attendance records
    function getAllAttendance() public view returns (address[] memory, bool[] memory) {
        bool[] memory attendanceRecords = new bool[](studentList.length);
        for (uint i = 0; i < studentList.length; i++) {
            attendanceRecords[i] = attendance[studentList[i]];
        }
        return (studentList, attendanceRecords);
    }

    // Internal method to check if a student is in the studentList
    function isStudentInList(address _student) internal view returns (bool) {
        for (uint i = 0; i < studentList.length; i++) {
            if (studentList[i] == _student) {
                return true;
            }
        }
        return false;
    }
}