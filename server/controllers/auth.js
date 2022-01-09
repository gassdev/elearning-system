import User from '../models/user'
import { hashPassword, comparePassword } from '../utils/auth'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    // console.log(req.body)
    const { name, email, password } = req.body
    // validation
    if (!name) return res.status(400).send('Name is required')
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send('Password is required and should be minimum 6 characters long')
    }

    let userExist = await User.findOne({ email }).exec()
    if (userExist) {
      return res.status(400).send('That email is already taken')
    }

    // hash password
    const hashedPassword = await hashPassword(password)

    // register user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    })
    await user.save()
    console.log('save user ---> ', user)
    // return res.json({ ok: true })
    return res.json({ ok: true })
  } catch (err) {
    console.log(err)
    return res.status(400).send('Error. Try again.')
  }
}

export const login = async (req, res) => {
  try {
    // console.log(req.body)

    const { email, password } = req.body

    // check if our database has user with that email
    const user = await User.findOne({ email }).exec()
    if (!user) return res.status(400).send('No user found')

    // check password
    const match = await comparePassword(password, user.password)

    if (!match) res.status(400).send('Invalid email/password')

    if (match) {
      // create signed jwt
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      })

      // return user and token to client, exclude hashed password
      user.password = undefined

      // send token and cookie
      res.cookie('token', token, {
        httpOnly: true,
        // secure: true, // only works on https
      })

      // send user as json response
      res.json(user)
    }
  } catch (err) {
    console.log(err)
    return res.status(400).send('Error. Try again.')
  }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie('token')
    return res.json({
      message: 'Signout success',
    })
  } catch (err) {
    console.log(err)
  }
}

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').exec()
    console.log('CURRENT USER ---> ', user)
    return res.json({ ok: true })
  } catch (err) {
    console.log(err)
  }
}

export const sendTestEmail = async (req, res) => {
  console.log('send email using SES')
  res.json({ ok: true })
}
