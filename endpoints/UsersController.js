  //*______________________________________________/
 //*- - - - -USERS ENDPOINTS CONTROLS- - - - - - -/
//*______________________________________________/

import UsersModel from "../models/UsersModel.js";



//^________________//
//^______GET______// 
//^______________//

// GET ALL
export const getUsers = async (req, res) => {
    try {
        // search users
        const users = await UsersModel.find();

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ 
            message: `Internal server error in [UsersController] while getting all ${users}: ${err}`
        });
    }
}

// GET ONE
export const getUser = async (req, res) => {
    try {
        // extract id from req params
        const { id } = req.params;

        // search user by id
        const user = await UsersModel.findById(id);

        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ 
            message: `User not found, error: ${err.message} in [UsersController] while getting user`
        });
    }
};

// GET ALL BY USER ID
export const userFriends = async (req, res) => {
    try {
        // extract id from req params
        const { id } = req.params; 

        // search user by id
        const user = await UsersModel.findById(id); 
        
        // query all friends on db w/ aggregate 
        // const friends = await UsersModel.aggregate([
        //     { $match: { _id: { $in: user.friends } } }
        // ]);
        const friends = await Promise.all(
            user.friends.map((id) => UsersModel.findById(id))
        )

        // extract desired fields from each friend obj
        const parsedFriends = friends.map(({ 
            _id,
            firstName,
            lastName,
            email,
            picturePath,
            friends,
            occupation,
            location
        }) => { 
            return { 
                _id,
                firstName,
                lastName,
                email,
                picturePath,
                friends,
                occupation,
                location
        }}) 
        
        res.status(200).json(parsedFriends);
    } catch (err) {
        res.status(404).send({ 
            message: `Error retrieving user friends in [UsersController]: ${err.message}`,
        });
    }
};


//^________________//
//^______PUT______// 
//^______________//

// CREATE ONE
export const newUser = async (req, res) => {
    const newUser = new UsersModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        location: req.body.location,
    });
    
    try {
        const savedUser = await newUser.save();
        res.status(200).send({
            message: "User created successfully in database",
            payload: savedUser
        });
    } catch(err) {
        res.status(500).json({ 
            message: `Internal server error: ${err.message} in [UsersController] while creating user`
        });
    }
};

//^__________________//
//^______PATCH______// 
//^________________//

// ADD/REMOVE FRIEND FROM LIST
export const toggleFriend = async (req, res) => {
    try {
        // extract id from req params
        const { id: userId, friendId } = req.params;

        // search user by id
        const user = await UsersModel.findById(userId);

        // search friend by id
        const friend = await UsersModel.findById(friendId);
        
        // check if friend included
        if (user.friends.includes(friendId)) {
            // new user list without friend
            user.friends = user.friends.filter((id) => id !== friendId);
            // new friend list without user
            friend.friends = friend.friends.filter((id) => id !== userId)
            // save both on db
            await user.save();
            await friend.save();
        } else {
            // push friend in user-list
            user.friends.push(friendId);
            // push user in friend-list
            friend.friends.push(userId)
        }
            // save both on db
            await user.save();
            await friend.save();
            
        // query all friends w/ aggregate function
        // const friends = await UsersModel.aggregate([
        //     { $match: { _id: { $in: user.friends } } }
        // ]);
        const friends = await Promise.all(
            user.friends.map((userId) => UsersModel.findById(userId))
        );

        // extract desired fields from each friend obj
        const parsedFriends = friends.map(
            ({
                _id,
                firstName,
                lastName,
                picturePath,
                location,
                occupation
            }) => {
                return {
                    _id,
                    firstName,
                    lastName,
                    picturePath,
                    location,
                    occupation
                };
            }
        )

        res.status(200).json(parsedFriends);
    } catch(err) {
        res.status(404).json({
            message: `Error updating friend list - list not found: ${err.message}`
        });
    }
};

// EDIT ONE
export const editUser = async (req, res) => {
    const { id } = req.params;
    const userExist = await UsersModel.findById(id);
    if (!userExist) {
        return res.status(404).send({
            message: `This user doesn't exist! Error in [UsersController] while [edit user]`
        });
    }
    try {
        const userEditing = req.body;
        const options = { new: true };
        const userUpdated = await UsersModel.findByIdAndUpdate(id, userEditing, options);
        res.status(200).send({
            message: "User updated successfully",
            payload: userUpdated
        });
    } catch(error) {
        res.status(500).json({ 
            message: `Internal server error in [UsersController] while [edit user] --> ${error}`
        });
    }
};

//^###################### 
//^####----DELETE----####
//^######################

// USER DELETE
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await UsersModel.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).send({
                message: `User ${id} doesn't exist`,
                statusCode: 404
            })
        }

        res.status(200).send({
            message: `User ${id} successfully deleted from database`,
            statusCode: 200
        })
    } catch (error) {
        res.status(500).send({
            message: `Server internal error (DELETE/user): ${error}`,
            statusCode: 500
        })
    }
}