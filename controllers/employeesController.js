const data = {
    employees: require("../model/employees.json"),
    setEmployees: function (data) {
        this.employees = data;
    },
};

const getAllEmployees = (req, res) => {
    res.json(data.employees);
};

const createEmployee = (req, res) => {
    const newEmployee = {
        id: data.employees[data.employees.length - 1].id + 1 || 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
    };

    if (!newEmployee.firstname || !newEmployee.lastname) {
        res.status(400).json({ message: "First and last names are required." });
    }

    data.setEmployees([...data.employees, newEmployee]);
    res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
    const employee = data.employees.find(
        (employee) => employee.id === parseInt(req.body.id)
    );

    if (!employee) {
        res.status(400).json({
            message: `Employee ID ${req.body.id} not found.`,
        });
    }

    if (employee.firstname) employee.firstname = req.body.firstname;
    if (employee.lastname) employee.lastname = req.body.lastname;

    const filteredEmployees = data.employees.filter(
        (employee) => employee.id != req.body.id
    );

    const unsortedEmployees = [...filteredEmployees, employee];

    data.setEmployees(
        unsortedEmployees.sort((a, b) =>
            a.id > b.id ? 1 : a.id < b.id ? -1 : 0
        )
    );

    res.json(data.employees);
};

const deleteEmployee = (req, res) => {
    const employee = data.employees.find(
        (employee) => employee.id === parseInt(req.body.id)
    );

    if (!employee) {
        res.status(400).json({
            message: `Employee ID ${req.body.id} not found.`,
        });
    }

    const filteredEmployees = data.employees.filter(
        (employee) => employee.id != req.body.id
    );

    data.setEmployees([...filteredEmployees]);
    res.json(data.employees);
};

const getEmployee = (req, res) => {
    const employee = data.employees.find(
        (employee) => employee.id === parseInt(req.params.id)
    );

    if (!employee) {
        res.status(400).json({
            message: `Employee ID ${req.params.id} not found.`,
        });
    }

    res.json(employee);
};

module.exports = {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
};
