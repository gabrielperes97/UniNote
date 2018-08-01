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
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql("data and salt arguments required");
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
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('message').eql("User created with success");
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
                        res.body.should.have.property('success').eql(false);
                        res.body.should.have.property("message").eql("This username has no available");
                    done();
                    });
            });
        })
    });
});