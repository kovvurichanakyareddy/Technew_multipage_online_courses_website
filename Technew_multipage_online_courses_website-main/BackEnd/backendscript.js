const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const PORT =  4000;

app.use(cors());

mongoose.connect('mongodb+srv://22a95a0512:7qFk1s8MlKETMBFW@cluster0.umd4olq.mongodb.net/TechNew?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

  //Decoding
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());


  const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    mobile: Number,
    country: String
  });

  const User = mongoose.model('User', userSchema);

  //Login Request
  app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // console.log(req.body);
    // Check if user with provided email and password exists in the database
    User.findOne({ email: email, password: password }).exec()
        .then(user => {
            if (user) {
                // User found, login successful
                res.json({ user, success: true, message: 'Login Successful' });
            } else {
                // No user found with provided credentials
                res.json({ success: false, message: 'Incorrect email or password' });
            }
        })
        .catch(err => {
            console.error('Error logging in:', err);
            res.status(500).json({ success: false, message: 'An error occurred' });
        });
  });
  
  app.post('/register-user', (req, res) => {
    const { email, password, name, mobile, country } = req.body;
    const newUser = new User({
      email: email,
      password: password,
      name: name,
      mobile: mobile,
      country: country,
    });

    User.findOne({ email: email }).exec()
        .then(user => {
            if (user) {
                // An Existing User found
                res.json({ message: 'User Already Exists!' });
            } else {
                // Save the new user to the database
                newUser.save()
                .then(savedUser => {
                  // If saved successfully, send a JSON response
                  res.json({
                    message: 'User registered successfully',
                    user: savedUser
                  });
              })
            }
        })
      .catch(err => {
        // If an error occurs, send a 500 status code and an error message
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'An error occurred while registering user' });
      });
  });


  app.post('/reset-password', (req, res) => {
    const { email, mobile, password } = req.body;
  
    // Find user by email and update password
    User.findOneAndUpdate({ email: email, mobile: mobile }, { password: password }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'Password updated successfully' });
        })
        .catch(err => {
            console.error('Error resetting password:', err);
            res.status(500).json({ message: 'An error occurred while resetting password' });
        });
  });


  //Find user and update details
  app.post('/edit-user', (req, res) => {
    let { email, password, name, number, country } = req.body;
    // Find user by email and update password
    console.log(req.body);
    User.findOneAndUpdate({ email: email, password: password }, { name: name, number: number, country: country }, { new: true }).exec()
        .then(user => {
            res.json({user});
            // res.json({ message: 'Details Updated Successfully!' });
        })
        .catch(err => {
            console.error('Error updating details:', err);
            res.status(500).json({ message: 'An error occurred while updating details' });
        });
  });


  // Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });