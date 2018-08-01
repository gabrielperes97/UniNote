process.env.NODE_ENV = "test";
mongoose = require("mongoose");
User = require('../api/models/user')

chai = require("chai")
chaiHttp =  require("chai-http");
server = require("../server");
should = chai.should();

chai.use(chaiHttp);

describe("Users", () =>{

    //esvazia o banco a cada teste
    beforeEach((done) => {
        User.remove({}, (err) => {
            done();
        });
    });

    describe("/POST user", () => {
        it("Não deve salvar quando faltar algum campo", (done) => {
            let user = {
                firstname: "Gabriel",
                lastname: "Peres",
                username: "gabrielperes",
                //password: "123321",
                email: "gabriel@peres.com"
            }

            chai.request(server)
                .post("/user")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('password');
                    res.body.errors.password.should.have.property('kind').eql('required');
                done();
                });
        });

        it("Deve cadastrar um usuário", (done) => {
            let user = {
                firstname: "Gabriel",
                lastname: "Peres",
                username: "gabrielperes",
                password: "123321",
                email: "gabriel@peres.com"
            }
            chai.request(server)
                .post("/user")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('firstname');
                    res.body.should.have.property('lastname');
                    res.body.should.have.property('username');
                    res.body.should.have.property('password');
                    res.body.should.have.property('email');
                    res.body.should.have.property('created_date');
                done();
                });
        });

        it("Não deve haver usuários iguais", (done) => {
            let user1 = {
                firstname: "Gabriel",
                lastname: "Peres Leopoldino",
                username: "gabrielperes",
                password: "123321",
                email: "gabriel@peres.com"
            };
            let user2 = {
                firstname: "Gabriel",
                lastname: "Peres da Silva",
                username: "gabrielperes",
                password: "321321",
                email: "gabriel@silva.com"
            };
            let user = new User(user1);
            user.save((err, user) => {
                chai.request(server)
                    .post("/user")
                    .send(user2)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('sucess').eql(false);
                        res.body.should.have.property("message").eql("This usename has no available");
                    done();
                    });
            });
        })
    });
});