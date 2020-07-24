const request = require('supertest');
const { app } = require('../src/app');

describe('Integration tests', () => {
  describe('Handlers', () => {
    describe('newStory', () => {
      it('should get editor html', (done) => {
        request(app)
          .get('/newStory')
          .expect(200)
          .expect('Content-Type', /html/)
          .expect(/editor/, done);
      });
    });

    describe('createStory', () => {
      it('should create a story and give back the story id', (done) => {
        request(app)
          .get('/createStory')
          .expect(200)
          .expect('Content-Type', /json/)
          .expect({ id: 5 }, done);
      });

      it('should create a story with incremented id', (done) => {
        request(app)
          .get('/createStory')
          .expect(200)
          .expect('Content-Type', /json/)
          .expect({ id: 6 }, done);
      });
    });

    describe('updateStory', () => {
      it('should update a story title, content for given story id', (done) => {
        const block = {
          type: 'paragraph',
          data: {
            text: 'A small paragraph',
          },
        };
        const data = { id: 1, title: 'A new app', blocks: [block] };
        request(app)
          .post('/updateStory')
          .send(data)
          .expect(200)
          .expect('Content-Type', /json/)
          .expect({ status: 'updated' }, done);
      });

      it('should give error for updating story with unknown id', (done) => {
        request(app)
          .post('/updateStory')
          .send({ id: 100 })
          .expect(404)
          .expect('Content-Type', /json/)
          .expect({ error: 'unknown id' }, done);
      });
    });
  });
});

describe('handleHomePage', () => {
  it('should get index page if session not exists', (done) => {
    app.set('sessionMiddleware', (req, res, next) => {
      req.session = { isNew: true };
      next();
    });
    request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(/Login Using Github/, done);
  });

  it('should get welcome page if session not exists', (done) => {
    app.set('sessionMiddleware', (req, res, next) => {
      req.session = { isNew: false, id: 56071561 };
      next();
    });
    request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(/Hello, anil-muraleedharan/, done);
  });
});
