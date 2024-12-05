import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
// import { DevTool } from '@hookform/devtools';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import departments from './Data/departments.json'
import ToastComponent from "./ToastComponent";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Email format is not valid")
    .required("Email is required"),
  department: yup.string().required("Department is required"),
  roles: yup.string().required("Roles is required"),
  joiningDate: yup.string().required("Joining date is required"),
});

const AddEditEmployee = ({
  isEmployeeDialogVisible,
  onHide,
  employees,
  setEmployees,
  employeeToEdit,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });
  const [departments, setDepartments] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const roles = [
    { label: "Manager", value: "Manager" },
    { label: "Developer", value: "Developer" },
    { label: "Designer", value: "Designer" },
  ];

  useEffect(() => {
    // Fetch departments from the local JSON file in the public folder
    fetch("departments.json")
      .then((response) => response.json())
      .then((data) => setDepartments(data))
      .catch((error) => console.error("Error loading departments:", error));
  }, []);

  useEffect(() => {
    // Convert the array into a JSON string and save it to local storage
    if (employees.length > 0) {
      localStorage.setItem("employees", JSON.stringify(employees));
    }
  }, [employees]);

  useEffect(() => {
    reset({
      name: employeeToEdit?.name || "",
      email: employeeToEdit?.email || "",
      department: employeeToEdit?.department || "",
      roles: employeeToEdit?.roles || "",
      joiningDate: employeeToEdit?.joiningDate
        ? new Date(employeeToEdit.joiningDate)
        : null,
    });
  }, [employeeToEdit, reset]);

  const onSubmit = (employee) => {
    if (employeeToEdit && employeeToEdit.id) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === employeeToEdit.id ? { ...employee, id: emp.id } : emp
        )
      );
      setToastMessage({
        severity: "success",
        summary: "Updated",
        detail: `Employee ${employeeToEdit?.name || ""} updated successfully`,
      });
    } else {
      setEmployees((prev) => [...prev, { ...employee, id: Date.now() }]);
      setToastMessage({
        severity: "success",
        summary: "Created",
        detail: `Employee created successfully`,
      });
    }
    onCloseDialog();
  };

  const onCloseDialog = () => {
    onHide();
    reset();
  };

  return (
    <>
      <ToastComponent
        severity={toastMessage?.severity}
        summary={toastMessage?.summary}
        detail={toastMessage?.detail}
        life={3000}
      />

      <Dialog
        header={employeeToEdit ? "Edit employee" : "Add employee"}
        visible={isEmployeeDialogVisible}
        onHide={onCloseDialog}
        style={{ width: "50vw" }}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="formgrid grid">
            <div className="field col-12 md:col-6 lg:col-6 xl:col-4 flex flex-column">
              <label htmlFor="name">Name</label>
              <InputText type="text" id="name" {...register("name")} />
              <p className="p-error">{errors.name?.message}</p>
            </div>
            <div className="field col-12 md:col-6 lg:col-6 xl:col-4 flex flex-column">
              <label htmlFor="email">Email</label>
              <InputText type="email" id="email" {...register("email")} />
              <p className="p-error">{errors.email?.message}</p>
            </div>
            <div className="field col-12 md:col-6 lg:col-6 xl:col-4 flex flex-column">
              <label htmlFor="department">Department</label>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    id="department"
                    options={departments}
                    optionLabel="label"
                    placeholder="Select a Department"
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                  />
                )}
              />
              <p className="p-error">{errors.department?.message}</p>
            </div>
            <div className="field col-12 md:col-6 lg:col-6 xl:col-4 flex flex-column">
              <label htmlFor="roles">Role</label>
              <Controller
                name="roles"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    id="roles"
                    options={roles}
                    optionLabel="label"
                    placeholder="Select a Roles"
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                  />
                )}
              />
              <p className="p-error">{errors.roles?.message}</p>
            </div>
            <div className="field col-12 md:col-6 lg:col-6 xl:col-4 flex flex-column">
              <label htmlFor="joiningDate">Joining date</label>
              <Controller
                name="joiningDate"
                control={control}
                render={({ field }) => (
                  <Calendar
                    id="joiningDate"
                    control={control}
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    dateFormat="dd/mm/yy"
                  />
                )}
              />
              <p className="p-error">{errors.joiningDate?.message}</p>
            </div>
          </div>
          <div className="dialog-footer">
            <Button
              type="button"
              severity="secondary"
              label="Cancel"
              className="mr-2"
              onClick={onCloseDialog}
            />
            <Button
              type="submit"
              severity="success"
              label={employeeToEdit ? "Update" : "Create"}
            />
          </div>
        </form>
        {/* <DevTool control={control} /> */}
      </Dialog>
    </>
  );
};

export default AddEditEmployee;
