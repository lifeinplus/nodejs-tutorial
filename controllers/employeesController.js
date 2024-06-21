const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find().exec();

    if (!employees) {
        return res.status(204).json({ message: "No employees found" });
    }

    return res.json(employees);
};

const createEmployee = async (req, res) => {
    const { firstname, lastname } = req.body;

    if (!firstname || !lastname) {
        return res
            .status(400)
            .json({ message: "First and last names are required" });
    }

    try {
        const result = await Employee.create({
            firstname,
            lastname,
        });
        return res.status(201).json(result);
    } catch (error) {
        console.error(error);
    }
};

const updateEmployee = async (req, res) => {
    const { id, firstname, lastname } = req.body;

    if (!id) {
        return res.status(400).json({
            message: `ID parameter is required`,
        });
    }

    const employee = await Employee.findOne({ _id: id }).exec();

    if (!employee) {
        return res.status(204).json({
            message: `No employee matches ID ${id}`,
        });
    }

    if (firstname) employee.firstname = firstname;
    if (lastname) employee.lastname = lastname;

    const result = await employee.save();
    return res.json(result);
};

const deleteEmployee = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({
            message: `Employee ID required`,
        });
    }

    const employee = await Employee.findOne({ _id: id }).exec();

    if (!employee) {
        return res.status(204).json({
            message: `No employee matches ID ${id}`,
        });
    }

    const result = await employee.deleteOne({ _id: id });
    return res.json(result);
};

const getEmployee = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: `Employee ID required`,
        });
    }

    const employee = await Employee.findOne({ _id: id }).exec();

    if (!employee) {
        return res.status(204).json({
            message: `No employee matches ID ${id}`,
        });
    }

    return res.json(employee);
};

module.exports = {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
};
