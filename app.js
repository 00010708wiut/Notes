const express = require('express')
const app = express()
const fs = require('fs')

app.set('view engine','pug')

app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))

const db = './data/tasks.json'

app.get('/',(req,res) => {
	res.render('home')
})

app.get('/create', (req, res) => {
	res.render('create')
})

app.post('/create', (req, res) => {
	const title = req.body.title
	const description = req.body.description

	if (title.trim() === '' && description.trim() === '') {
		res.render('create', { error: true })
	} else {
		fs.readFile(db, (err, data) => {
			if (err) throw err

			const tasks = JSON.parse(data)

			const newTask = {
				id: id(),
				title: title,
				description: description 
			}

			tasks.push(newTask)

			fs.writeFile(db, JSON.stringify(tasks), err => {
				if (err) throw err

				res.render('create', { success: true })
			})
		})
	}
})


app.get('/tasks', (req, res) => {
	fs.readFile(db, (err, data) => {
		if (err) throw err

		const tasks = JSON.parse(data)

		res.render('tasks', { tasks: tasks })
	})
})



app.get('/tasks/:id', (req, res) => {
	const id = req.params.id

	fs.readFile(db, (err, data) => {
		if (err) throw err

		const tasks = JSON.parse(data)

		const task = tasks.filter(task => task.id == id)[0]

		res.render('detail', { task: task })
	})
})

app.listen(8000, err =>{
	if(err) throw err

		console.log('App is running...')
})

function id () {
  return '_' + Math.random().toString(36).substr(2, 9);
}