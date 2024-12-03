import React, { useState, useEffect } from "react";
import { Button } from 'primereact/button';
import AddEditEmployee from './AddEditEmployee';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from "primereact/card";
import { FilterMatchMode } from "primereact/api";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Sidebar } from 'primereact/sidebar';
import DeleteEmployee from "./DeleteEmployee";
import { InputSwitch } from "primereact/inputswitch";

const EmployeeTable = () => {
    const [isEmployeeDialogVisible, setIsEmployeeDialogVisible] = useState(false);
    const [employees, setEmployees] = useState([])
    const [selectedEmployee, setSelectedEmployee] = useState(null)
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        department: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
    })
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [groupByDepartment, setGroupByDepartment] = useState(false);
    const [checked, setChecked] = useState(groupByDepartment);
    const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state


    const groupedData = groupByDepartment
        ? employees.reduce((acc, employee) => {
            const department = employee.department;
            acc[department] = acc[department] || [];
            acc[department].push(employee);
            return acc;
        }, {})
        : { "All Employees": employees };

    const onGlobalFilterChange = (e) => {
        let value = e.target.value;
        let _filters = { ...filters }
        _filters['global'].value = value;
        setFilters(_filters)
        setGlobalFilterValue(value)
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Employee search" />
                </IconField>
            </div>
        )
    }

    const formatJoiningDate = (rowData) => {
        const date = new Date(rowData.joiningDate);
        return date.toLocaleDateString('en-GB');
    };


    useEffect(() => {
        // Apply dark mode to body element based on state

        if (isDarkMode) {
            document.body.classList.add('dark-mode')
        } else {
            document.body.classList.remove('dark-mode')
        }
        // Retrieve existing employees from local storage
        try {
            const storedEmployees = localStorage.getItem('employees');
            const localStoredEmployees = storedEmployees ? JSON.parse(storedEmployees) : [];
            setEmployees(localStoredEmployees);
        } catch (error) {
            console.error('Error loading employees:', error);
        }
    }, [isDarkMode])

    const editHandler = (rowData) => {
        setSelectedEmployee(rowData)
        setIsEmployeeDialogVisible(true)
    }

    const deleteHandler = (rowData) => {
        setSelectedEmployee(rowData)
        setIsDeleteDialogVisible(true)
    }

    const viewDetailsHandler = (rowData) => {
        setSelectedEmployee(rowData)
        setIsSidebarVisible(true)
    }

    const handleDialogClose = () => {
        setIsEmployeeDialogVisible(false);
        setIsDeleteDialogVisible(false);
    }

    const header = renderHeader()

    return (
        <div className="px-4 py-2">
            <div className="flex justify-content-between align-self-center">
                <h1 className="title">Employee Details</h1>
                <Button label="Add Employee"
                    className="add-employee-btn flex align-self-center" severity='success'
                    onClick={() => {
                        setSelectedEmployee(null); // Reset to null
                        setIsEmployeeDialogVisible(true); // Open modal
                    }}
                />
            </div>
            <div className="flex flex-row justify-content-end dark-mode-switch">
                <h4>{isDarkMode ? "Light Mode" : "Dark mode"}</h4>
                <InputSwitch
                    checked={isDarkMode}
                    onChange={(e) => setIsDarkMode(e.value)} // Update the dark mode
                    className="dark-mode-toggle-btn"
                />
            </div>
            <Card>
                {employees.length > 0 ? (
                    <div className="employee-table">
                        <div className="flex flex-row employee-switch">
                            <h4>Group employees by department</h4>
                            <InputSwitch
                                checked={checked}
                                onChange={(e) => {
                                    setChecked(e.value); // Update the checked state
                                    setGroupByDepartment(e.value); // Update the grouping logic
                                }}
                                className="toggle-btn"
                            />
                        </div>
                        {!groupByDepartment ?
                            (
                                <DataTable value={employees} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} dataKey="id" filters={filters} filterDisplay='row' globalFilterFields={['name', 'email', 'roles', 'department']} header={header} emptyMessage="No employees found"
                                    tableStyle={{ minWidth: '50rem' }}>
                                    <Column field="name" header="Name" sortable ></Column>
                                    <Column field="email" header="Email" sortable ></Column>
                                    <Column field="roles" header="Role" sortable ></Column>
                                    <Column field="department" header="Department" sortable ></Column>
                                    <Column
                                        field="joiningDate"
                                        header="Joining Date"
                                        body={formatJoiningDate}
                                        sortable
                                    />
                                    <Column header="Actions" body={(rowData) => (
                                        <div>
                                            <button className="edit-delete-btn" onClick={() => editHandler(rowData)}>
                                                <i className="pi pi-pencil" />
                                            </button>
                                            <button className="edit-delete-btn" onClick={() => deleteHandler(rowData)}>
                                                <i className="pi pi-trash" />
                                            </button>
                                            <button className="edit-delete-btn" onClick={() => viewDetailsHandler(rowData)}>
                                                <i className="pi pi-arrow-right" />
                                            </button>
                                        </div>
                                    )} />
                                </DataTable>
                            ) :
                            (
                                <DataTable value={Object.keys(groupedData)}>
                                    <Column
                                        header="Department"
                                        body={(data) => {
                                            return <strong>{data}</strong>;
                                        }}
                                    />
                                    <Column
                                        header="Employees"
                                        body={(data) => {
                                            return groupedData[data].map((employee, index) => (
                                                <div key={index}>
                                                    <p>{employee.name}</p>
                                                </div>
                                            ));
                                        }}
                                    />
                                </DataTable>
                            )
                        }
                    </div>
                ) : <div>No employees found</div>}

                <Sidebar visible={isSidebarVisible} onHide={() => setIsSidebarVisible(false)}>
                    {selectedEmployee && (
                        <div>
                            <h2>Employee Details</h2>
                            <p><strong>Name:</strong> {selectedEmployee.name}</p>
                            <p><strong>Email:</strong> {selectedEmployee.email}</p>
                            <p><strong>Department:</strong> {selectedEmployee.department}</p>
                            <p><strong>Role:</strong> {selectedEmployee.roles}</p>
                            <p><strong>Joining Date:</strong> {formatJoiningDate(selectedEmployee)}</p>
                        </div>
                    )}
                </Sidebar>
            </Card>
            <AddEditEmployee isEmployeeDialogVisible={isEmployeeDialogVisible} onHide={handleDialogClose} setEmployees={setEmployees} employees={employees} employeeToEdit={selectedEmployee} />
            <DeleteEmployee isDeleteDialogVisible={isDeleteDialogVisible} onHide={handleDialogClose} employeeToDelete={selectedEmployee} setEmployees={setEmployees} />
        </div>
    )
}

export default EmployeeTable;