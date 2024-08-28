// src/components/AttendanceTracker.js

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import AttendanceTrackerABI from "./AttendanceTracker.json"; // Import ABI JSON
import "./AttendanceTracker.css"; // Import CSS

const AttendanceTracker = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [studentAddress, setStudentAddress] = useState("");
  const [attendance, setAttendance] = useState({});
  const [students, setStudents] = useState([]);

  const contractAddress = "0xD5A67bbE133c1CeAFFe12BB49D970b7Db0b44708";

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        try {
          // Request account access if needed
          await window.ethereum.request({ method: "eth_requestAccounts" });

          // Create a Web3 instance using the injected provider from MetaMask
          const web3 = new Web3(window.ethereum);

          // Create contract instance
          const instance = new web3.eth.Contract(
            AttendanceTrackerABI.abi,
            contractAddress
          );

          // Get accounts
          const accounts = await web3.eth.getAccounts();

          console.log(instance, accounts);

          // Set the contract and accounts in state
          setContract(instance);
          setAccounts(accounts);
          setAccount(accounts[0]);
        } catch (error) {
          console.error("Error connecting to MetaMask", error);
        }
      } else {
        console.error("MetaMask not detected");
      }
    };

    loadWeb3();
  }, []);

  const markAttendance = async () => {
    await contract.methods
      .markAttendance(studentAddress)
      .send({ from: account });
    alert(`student address ${studentAddress} is marked present !`);
    setStudentAddress("");
  };

  const unmarkAttendance = async () => {
    await contract.methods
      .unmarkAttendance(studentAddress)
      .send({ from: account });
    alert(`student address ${studentAddress} is marked absent !`);
    setStudentAddress("");
  };

  const checkAttendance = async () => {
    const isPresent = await contract.methods
      .isMarkedPresent(studentAddress)
      .call();
    setAttendance({ ...attendance, [studentAddress]: isPresent });
    alert(
      `student address : ${studentAddress} is ${
        isPresent ? "present" : "absent"
      }`
    );
    setStudentAddress("");
  };

  const getAllAttendance = async () => {
    const response = await contract.methods.getAllAttendance().call();
    const students = response[0];
    const statuses = response[1];
    console.log(students, statuses);
    const attendance = {};
    students.forEach((student, index) => {
      attendance[student] = statuses[index];
    });
    setStudents(students);
    setAttendance(attendance);
  };

  return (
    <div className="container">
      <h1>Attendance Tracker</h1>
      <p>Account: {account}</p>
      <div className="form">
        <input
          type="text"
          placeholder="Student Address"
          value={studentAddress}
          onChange={(e) => setStudentAddress(e.target.value)}
          list="accounts"
        />
        <datalist id="accounts">
          {accounts.map((acc, index) => (
            <option key={index} value={acc} />
          ))}
        </datalist>
        <button onClick={markAttendance}>Mark Attendance</button>
        <button onClick={unmarkAttendance}>Unmark Attendance</button>
        <button onClick={checkAttendance}>Check Attendance</button>
        <button onClick={getAllAttendance}>Get All Attendance</button>
      </div>
      <h2>Attendance Status</h2>
      <div className="attendance-list">
        {students.map((student, index) => (
          <div className="attendance-item" key={index}>
            <p>{student}</p>
            <p>{attendance[student] ? "Present" : "Absent"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceTracker;
