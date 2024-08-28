# Attendance Tracker Smart Contract

This Solidity program is a simple Attendance Tracker contract that demonstrates the basic syntax and functionality of the Solidity programming language. The purpose of this program is to serve as a starting point for those who are new to Solidity and want to get a feel for how it works.

## Description

This program is a basic Attendance Tracker contract written in Solidity, a programming language used for developing smart contracts on the Ethereum blockchain. The contract includes functionalities such as markAttendance, UnmarkAttendance, getAllAttendance and isStudentinList. This program serves as a simple and straightforward introduction to Solidity programming and can be used as a stepping stone for more complex projects in the future.

In this smart contract we also implements the require(), assert() and revert() statements.

We are also going to use react and web3 to connect our blockchain to frontend.


## Usage/Examples

```solidity

// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

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

        // Mark the student as present
        attendance[_student] = true;

        // Add the student to the studentList if not already present
        if (!isStudentInList(_student)) {
            studentList.push(_student);
            emit StudentAdded(_student); // Emit event when a student is added
        }

        // Emit event when attendance is marked
        emit AttendanceMarked(_student, true);

        // Assert that the student is now marked as present
        assert(attendance[_student] == true);
    }

    function unmarkAttendance(address _student) public {
        // Only the teacher can unmark attendance
        require(msg.sender == teacher, "Only the teacher can unmark attendance");

        // Check if the student is already marked as present and if not reverts with the following error message 
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
        
    
```


## Run Locally

Clone the project

```bash
  git clone https://github.com/Swarnal7i/Eth-Ass2.git
```

Go to the project directory

```bash
  cd Eth-Ass2
```

Go to the blockchain directory

```bash
  cd blockchain
```

Install dependencies

```bash
  npm install
```

Go to the frontend directory from another terminal

```bash
  cd frontend
```

Install dependencies

```bash
  npm install
```

Start the blockchain node from terminal which is in blockchain directory

```bash
  npx hardhat node
```

Start one more terminal in blockchain directory

```bash
  npx hardhat run --network localhost scripts/deploy.js
```

Start frontend from the terminalin frontend directory

```bash
  npm start
```

## Lessons Learned

- Integrate Solidity contracts with React using Hardhat and ensure ABI compatibility

- Use Hardhat for local blockchain development to speed up testing and deployment

- Utilize React hooks like useState and useEffect for efficient state management and handling blockchain interactions

- Gas Efficiency: Understanding gas implications of error handling helps design more efficient contracts.

- Design smart contracts to minimize gas costs and ensure reliable data storage and retrieval


## Author

- Swarnali Das Purkayastha
