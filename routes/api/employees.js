const express = require("express");

const ROLE_LIST = require("../../config/role_list");
const employeesController = require("../../controllers/employeesController");
const verifyRoles = require("../../middleware/verifyRoles");

const router = express.Router();

router
    .route("/")
    .get(employeesController.getAllEmployees)
    .post(
        verifyRoles(ROLE_LIST.admin, ROLE_LIST.editor),
        employeesController.createEmployee
    )
    .put(
        verifyRoles(ROLE_LIST.admin, ROLE_LIST.editor),
        employeesController.updateEmployee
    )
    .delete(verifyRoles(ROLE_LIST.admin), employeesController.deleteEmployee);

router.route("/:id").get(employeesController.getEmployee);

module.exports = router;
