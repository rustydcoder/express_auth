const router = require("express").Router();
const user = require("../controllers/user");
const auth = require("../middlewares/auth");

router.post("/register", user.register);
router.post("/login", user.login);
router.delete("/delete", auth, user.deleteUser);

router.post("/tokenIsValid", user.tokenIsValid);

module.exports = router;
