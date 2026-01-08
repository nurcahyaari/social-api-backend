let chai = require('chai');
let expect = chai.expect;
const request = require('supertest')

const mongoose = require('mongoose');
const db = require('../db');
const app = require('../app');

let mongoServer;
before(async function() {
    mongoServer = await db.connectMongoDB();
});

after(async function() {
    await db.disconnectMongoDB();
    if (mongoServer) await mongoServer.stop();
});

afterEach(async function () {
  if (mongoose.connection.readyState !== 1) return;

  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

function profileFactory() {
    return {
        name: 'test_user',
        description: 'This is a test user',
        mbti: 'INTJ',
        enneagram: '5w6',
        variant: 'sp',
        tritype: 514,
        socionics: 'LII',
        sloan: 'RCOEI',
        psyche: 'Melancholic',
        image: ''
    }
}

describe('Integration Tests', function() {
    describe('GET /profile', function() {
        it('should return all profiles', async function() {
            const res = await request(app).get('/profile');

            expect(res.status).to.equals(200);
            expect(res.body).to.have.property('profiles').that.is.an('array');
        });
    });
    
    describe('POST /profile', function() {
        it('should create a new profile', async function() {
            const res = await request(app)
                .post('/profile')
                .send(profileFactory());

            expect(res.status).to.equals(201);
            expect(res.body.profile).to.have.property('name', 'test_user');
            expect(res.body.profile).to.have.property('mbti', 'INTJ');
        });
    });

    describe('GET /profile/:name', function() {
        let profile;
        before(async function() {
            const res = await request(app)
                .post('/profile')
                .send(profileFactory());
            profile = res.body.profile;
        });

        it('should return profile data for valid user name', async function() {
            const res = await request(app)
                .get(`/profile/test_user`);

            expect(res.status).to.equals(200);
        });

        it('should return 404 for not found user name', async function() {
            const res = await request(app)
                .get('/profile/non_existent_user');

            expect(res.status).to.equals(404);
        });
    });



    describe('POST /post', function() {
        let profile;
        before(async function() {
            const res = await request(app)
                .post('/profile')
                .send(profileFactory());
            profile = res.body.profile;
        });

        it('should create a new post', async function() {
            const newPost = {
                title: 'Test Post',
                content: 'This is a test post content',
                vote: {
                    mbti: 'INTJ',
                    enneagram: '5w6',
                    zodiac: 'Capricorn'
                }
            };

            const res = await request(app)
                .post('/post')
                .set('x-user-name', 'test_user')
                .send(newPost);
            
            expect(res.status).to.equals(201);
            expect(res.body).to.have.property('success', true);
            expect(res.body).to.have.property('post');
            expect(res.body.post).to.have.property('title', 'Test Post');
        });
    });

    describe('GET /post', function() {
        it('should return all posts', async function() {
            const res = await request(app)
            .get('/post');

            expect(res.status).to.equals(200);
            expect(res.body).to.have.property('posts');
            expect(res.body.posts).to.be.an('array');
        });
    });

    describe('POST /post/:id/upvote', function() {
        let postId = '';

        before(async function() {
            await request(app)
                .post('/profile')
                .send(profileFactory());

            const newPost = {
                title: 'Upvote Test Post',
                content: 'This post will be upvoted',
                vote: {
                    mbti: 'ENTP',
                    enneagram: '7w8',
                    zodiac: 'Gemini'
                }
            };

            const resPost = await request(app)
                .post('/post')
                .set('x-user-name', 'test_user')
                .send(newPost);

            postId = resPost.body.post._id;
        });

        it('should upvote the post', async function() {
            const res = await request(app)
                .post(`/post/${postId}/upvote`)
                .set('x-user-name', 'test_user');

            expect(res.status).to.equals(200);   
            expect(res.body).to.have.property('success', true);
            expect(res.body).to.have.property('post');
            expect(res.body.post).to.have.property('totalLikes', 1);
        });
    });

    describe('GET /post with filters', function() {
        before(async function() {
            await request(app)
                .post('/profile')
                .send(profileFactory());

            const newPosts = [
                {
                    title: 'Upvote Test Post',
                    content: 'This post will be upvoted',
                    vote: {
                    mbti: 'ENTP',
                        enneagram: '7w8',
                        zodiac: 'Gemini'
                    }
                },
                {
                    title: 'Upvote Test Post',
                    content: 'This post will be upvoted',
                    vote: {
                        mbti: 'INFP',
                        enneagram: '7w8',
                        zodiac: 'Gemini'
                    }
                },
                {
                    title: 'Upvote Test Post',
                    content: 'This post will be upvoted',
                    vote: {
                        mbti: 'INFJ',
                        enneagram: '1w2',
                        zodiac: 'Gemini'
                    }
                },
            ];

            for (const newPost of newPosts) {
                await request(app)
                    .post('/post')
                    .set('x-user-name', 'test_user')
                    .send(newPost);
            }
        });

        it('should return posts filtered by mbti', async function() {
            const res = await request(app)
                .get('/post')
                .query({ filterBy: 'mbti', mbti: 'INTJ' });

            expect(res.status).to.equals(200);
            expect(res.body).to.have.property('posts');
                expect(res.body.posts).to.be.an('array');
                res.body.posts.forEach(post => {
                    expect(post.vote.mbti).to.equal('INTJ');
                    expect(post.vote.mbti).to.not.equal('ENTP');
                });
            });

        it('should return posts filtered by enneagram', async function() {
            const res = await request(app)
                .get('/post')
                .query({ filterBy: 'enneagram', enneagram: '1w2' });

            expect(res.status).to.equals(200);
            expect(res.body).to.have.property('posts');
            expect(res.body.posts).to.be.an('array');
            res.body.posts.forEach(post => {
                expect(post.vote.enneagram).to.equal('1w2');
                expect(post.vote.enneagram).to.not.equal('7w8');
            });
        });
    });
});