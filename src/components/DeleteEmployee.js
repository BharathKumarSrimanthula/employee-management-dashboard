import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import ToastComponent from "./ToastComponent";

const DeleteEmployee = ({
  isDeleteDialogVisible,
  onHide,
  employeeToDelete,
  setEmployees,
}) => {
  const [toastMessage, setToastMessage] = useState(null);

  const handleEmployeeDelete = () => {
    try {
      setEmployees((prev) => {
        const updatedEmployees = prev.filter(
          (emp) => emp.id !== employeeToDelete.id
        );
        localStorage.setItem("employees", JSON.stringify(updatedEmployees));
        return updatedEmployees;
      });
      setToastMessage({
        severity: "success",
        summary: "Deleted",
        detail: `Employee deleted successfully`,
      });
      onHide();
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <div>
      <ToastComponent
        severity={toastMessage?.severity}
        summary={toastMessage?.summary}
        detail={toastMessage?.detail}
        life={3000}
      />
      <Dialog
        header="Delete employee"
        visible={isDeleteDialogVisible}
        onHide={onHide}
        style={{ width: "50vw" }}
      >
        <p>Are you sure you want to delete this?</p>
        <div className="dialog-footer">
          <Button
            type="button"
            severity="secondary"
            label="No, Keep It"
            className="mr-2"
            onClick={onHide}
          />
          <Button
            type="submit"
            severity="success"
            label="Yes, Delete"
            onClick={handleEmployeeDelete}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default DeleteEmployee;
