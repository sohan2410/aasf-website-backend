import chai from "chai";
import request from "supertest";
import Server from "../server";
import mongo from "../server/common/mongo";
import userModel from "../server/models/user";

const expect = chai.expect;

describe("Users Authorization", () => {
  before(async () => {
    await mongo();
    await userModel.deleteMany({});
    await userModel.create({
      _id: "2018BCS-000",
      name: "AASF",
    });
  });

  it("should login user when provided with right credentials", async () => {
    const response = await request(Server)
      .post("/users/login")
      .send({ roll: "2018BCS-000", password: "aasf_iiitm" });
    expect(response.body).to.be.an("object");
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("token");
    expect(response.body).to.have.property("message");
    expect(response.body.token).to.be.a("string");
    expect(response.body.message).to.be.a("string");
  });

  it("should fail login when provided with wrong credentials", async () => {
    let response = await request(Server)
      .post("/users/login")
      .send({ roll: "2018BCS-00", password: "aasf_iiitm" });
    expect(response.body).to.be.an("object");
    expect(response.status).to.be.equal(400);
    expect(response.body).to.have.property("message");
    expect(response.body.message).to.be.a("string");

    response = await request(Server)
      .post("/users/login")
      .send({ roll: "2018BCS-000", password: "aasf_iiit" });
    expect(response.body).to.be.an("object");
    expect(response.status).to.be.equal(401);
    expect(response.body).to.have.property("message");
    expect(response.body.message).to.be.a("string");
  });
});

describe("User Operations(Change Password, Get Details)", () => {
  before(async () => {
    await mongo();
    await userModel.deleteMany({});
    await userModel.create({
      _id: "2018BCS-000",
      name: "AASF",
    });
  });

  let token;
  before(async () => {
    const response = await request(Server)
      .post("/users/login")
      .send({ roll: "2018BCS-000", password: "aasf_iiitm" });
    token = response.body.token;
  });

  it("changes password successfully for logged-in user", async () => {
    let response = await request(Server)
      .put("/users/password")
      .set("Authorization", `bearer ${token}`)
      .send({ currentPassword: "aasf_iiitm", newPassword: "aasf@iiitm" });
    expect(response.body).to.be.an("object");
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("message");
    expect(response.body.message).to.be.a("string");

    response = await request(Server)
      .post("/users/login")
      .send({ roll: "2018BCS-000", password: "aasf@iiitm" });
    expect(response.body).to.be.an("object");
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("token");
    expect(response.body).to.have.property("message");
    expect(response.body.token).to.be.a("string");
    expect(response.body.message).to.be.a("string");
  });

  it("fails password change for unauthenticated user", async () => {
    let response = await request(Server)
      .put("/users/password")
      .send({ currentPassword: "aasf@iiitm", newPassword: "aasf_iiitm" });
    expect(response.body).to.be.an("object");
    expect(response.status).to.be.equal(401);
    expect(response.body).to.have.property("message");
    expect(response.body.message).to.be.a("string");

    response = await request(Server)
      .put("/users/password")
      .set("Authorization", `bearer dummy`)
      .send({ currentPassword: "aasf@iiitm", newPassword: "aasf_iiitm" });
    expect(response.body).to.be.an("object");
    expect(response.status).to.be.equal(401);
    expect(response.body).to.have.property("message");
    expect(response.body.message).to.be.a("string");
  });

  it("fetches user details for logged-in user", async () => {
    const response = await request(Server)
      .get("/users/details")
      .set("Authorization", `bearer ${token}`);
    expect(response.body).to.be.an("object");
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("user");
    expect(response.body).to.have.property("message");
    expect(response.body.user).to.be.an("object");
    expect(response.body.message).to.be.a("string");

    expect(response.body.user).to.have.property("_id");
    expect(response.body.user._id).to.be.a("string");

    expect(response.body.user).to.have.property("name");
    expect(response.body.user.name).to.be.a("string");

    expect(response.body.user).to.have.property("score");
    expect(response.body.user.score).to.be.an("object");

    expect(response.body.user).to.have.property("achievements");
    expect(response.body.user.achievements).to.be.an("object");

    expect(response.body.user).to.have.property("role");
    expect(response.body.user.role).to.be.a("string");
  });
});
