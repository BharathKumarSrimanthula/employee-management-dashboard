import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const DeleteEmployee = ({ isDeleteDialogVisible, onHide, employeeToDelete, setEmployees }) => {

    const handleEmployeeDelete = () => {
        try {
            setEmployees((prev) => {
                const updatedEmployees = prev.filter((emp) => emp.id !== employeeToDelete.id)
                localStorage.setItem('employees', JSON.stringify(updatedEmployees))
                return updatedEmployees
            })
            onHide()
        } catch (error) {
           console.log('error',error)  
        }
    }

    return (
        <div>
            <Dialog header="Delete employee" visible={isDeleteDialogVisible} onHide={onHide} style={{ width: '50vw' }}>
                <h3>Are you sure you want to delete this?</h3>
                <div className='dialog-footer'>
                    <Button type="button" severity="secondary" label="No, Keep It" className='mr-2' onClick={onHide} />
                    <Button type="submit" severity='success' label="Yes, Delete" onClick={handleEmployeeDelete} />
                </div>
            </Dialog>
        </div>
    )
}

export default DeleteEmployee