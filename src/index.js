const express = require('express');
require('./db/mongoose')
const UsersRoute = require('./routers/user')
const TasksRoute = require('./routers/tasks')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(UsersRoute)
app.use(TasksRoute)

app.listen(port,()=> {
    console.log('Server is up on port '+port)
})
