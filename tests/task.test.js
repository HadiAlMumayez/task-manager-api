const request = require('supertest')
const Task = require('../src/models/task')
const app = require('../src/app')
const {user1Id,user1,user2Id,user2,task1,setupDB} = require('./fixtures/db')

beforeEach(setupDB)

test('should create task', async ()=>{
    const response = await request(app)
    .post('/tasks')
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send({
        description: "from my test "
    }).expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('GET tasks',async ()=>{
    const response = await request(app)
    .get('/tasks')
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .expect(200)

    expect(response.body.length).toEqual(2)
})

test('should not delete another user task',async ()=>{
    const response = await request(app)
    .delete('/tasks/'+task1._id)
    .set('Authorization',`Bearer ${user2.tokens[0].token}`)
    .send()
    .expect(404)

    const task = await Task.findById(task1._id)
    expect(task).not.toBeNull()
})
