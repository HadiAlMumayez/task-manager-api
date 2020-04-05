const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {user1Id,user1,setupDB} = require('./fixtures/db')

beforeEach(setupDB)



test('Should signup a new user', async ()=>{
    const response =await request(app).post('/users').send({
        name: "Hadi",
        email: "hadi@gmail.com",
        password: "hadi1234"
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertion about the response
    expect(response.body).toMatchObject({
        user:{
            name: "Hadi",
            email: "hadi@gmail.com"
        },
         token: user.tokens[0].token
        
    })

    expect(user.password).not.toBe('hadi1234')
})


test('should log in existing user',async ()=>{
    const response = await request(app).post('/users/login').send({
        email: user1.email,
        password: user1.password
    }).expect(200)

    const user = await User.findById(user1Id)
    expect(user.tokens[1].token).toBe(response.body.token)

})

test('should not login noneexistint user', async ()=>{
    await request(app).post('/users/login').send({
        email: user1.email,
        password: 'df45vvt8'
    }).expect(400)
})

test('should get profile for user',async ()=>{
    await request(app)
    .get('/users/me')
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)
})

test('should not get profile for unauthenticated user', async ()=>{
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('should delete authenticated user', async ()=>{
    await request(app)
    .delete('/users/me')
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)
    const user = await User.findById(user1Id)
    expect(user).toBeNull()
})

test('should not delete unauthenticated user', async ()=>{
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('should upload avatar image',async ()=>{
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)

    const user = await User.findById(user1Id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update valid user fields',async ()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send({name: "Ayham"})
    .expect(200)

    const user = await User.findById(user1Id)
    expect(user.name).toBe('Ayham')
})

test('should not update invalid user fields',async ()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send({location: "Ayham"})
    .expect(400)
})