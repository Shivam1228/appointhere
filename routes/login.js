const router =require("express").Router()

const User=require("../modules/user")
const bcrypt = require('bcrypt');



router.get("/" ,(req,res)=>{
    res.send(200).json("working")
})



//register
router.post("/register", async (req, res) => {
    try {
        if (!req.body.username || !req.body.email || !req.body.password) {
            // Handle missing data
            return res.status(400).json({ error: "Missing data" });
        }

        // Generate a salt
        const salt = await bcrypt.genSalt(10);

        // Check if salt is a string or a number
        if (typeof salt !== 'string' && typeof salt !== 'number') {
            return res.status(500).json({ error: "Invalid salt" });
        }

        // Hash the password
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        });

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});



//login
router.post("/login", async (req,res) =>{
    try{

        const user=await User.findOne({email: req.body.email})
        !user && res.status(400).json("not a user")
        
        const validate= await bcrypt.compare(req.body.password , user.password)
        !validate && res.status(400).json("not user")
        const {password, ...others}=user._doc
        res.status(200).json(others)

    }
    catch (err){
        res.status(500).json(err)
    }
})


module.exports=router