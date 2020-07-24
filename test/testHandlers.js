const request = require('supertest');
const {app} = require('../src/app');

describe('Integration tests', () => {
  describe('Handlers', () => {
    describe('unauthorized user', () => {
      before(() => {
        app.set('sessionMiddleware', (req, res, next) => {
          req.session = {isNew: true};
          next();
        });
      });
      it('should redirect to / for /newStory', (done) => {
        request(app).get('/newStory').expect(302).expect('location', '/', done);
      });
      it('should redirect to / for /createStory', (done) => {
        request(app)
          .get('/createStory')
          .expect(302)
          .expect('location', '/', done);
      });
      it('should redirect to / for /updateStory', (done) => {
        request(app)
          .post('/updateStory')
          .expect(302)
          .expect('location', '/', done);
      });
      it('should redirect to / for /stories', (done) => {
        request(app).get('/stories').expect(302).expect('location', '/', done);
      });
    });

    describe('authorized user', () => {
      describe('newStory', () => {
        before(() => {
          app.set('sessionMiddleware', (req, res, next) => {
            req.session = {isNew: false, id: 58025056};
            next();
          });
        });

        it('should get the newStory page for authenticated user', (done) => {
          request(app)
            .get('/newStory')
            .expect(200)
            .expect('Content-Type', /html/)
            .expect(/editor/, done);
        });
      });

      describe('createStory', () => {
        before(() => {
          app.set('sessionMiddleware', (req, res, next) => {
            req.session = {isNew: false, id: 111};
            next();
          });
        });

        it('should create a story and give back the story id', (done) => {
          request(app)
            .get('/createStory')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect({id: 5}, done);
        });

        it('should create a story with incremented id', (done) => {
          request(app)
            .get('/createStory')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect({id: 6}, done);
        });
      });

      describe('updateStory', () => {
        before(() => {
          app.set('sessionMiddleware', (req, res, next) => {
            req.session = {isNew: false, id: 58025056};
            next();
          });
        });

        it('should update story title, content for given story id', (done) => {
          const block = {
            type: 'paragraph',
            data: {
              text: 'A small paragraph',
            },
          };
          const data = {id: 1, title: 'A new app', blocks: [block]};
          request(app)
            .post('/updateStory')
            .send(data)
            .expect(200)
            .expect('Content-Type', /json/)
            .expect({status: 'updated'}, done);
        });

        it('should give error for updating story with unknown id', (done) => {
          request(app)
            .post('/updateStory')
            .send({id: 100})
            .expect(404)
            .expect('Content-Type', /json/)
            .expect({error: 'unknown id'}, done);
        });
      });
      describe('stories', () => {
        before(() => {
          app.set('sessionMiddleware', (req, res, next) => {
            req.session = {isNew: false, id: 58025056};
            next();
          });
        });

        it('should give story page with available drafts of user', (done) => {
          request(app)
            .get('/stories')
            .expect(200)
            .expect('Content-Type', /html/)
            .expect(/your stories/i, done);
        });
      });
    });
  });
});

describe('handleHomePage', () => {
  it('should get index page if session not exists', (done) => {
    app.set('sessionMiddleware', (req, res, next) => {
      req.session = {isNew: true};
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
      req.session = {isNew: false, id: 56071561};
      next();
    });
    request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect(/Hello, anil-muraleedharan/, done);
  });
});
