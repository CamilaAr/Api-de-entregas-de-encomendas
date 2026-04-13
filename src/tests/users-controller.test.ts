import request from "supertest";

import { app } from "@/app";
import { prisma } from "@/database/prisma";

describe("UsersController", () => {

  let user_id: string;

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        id: user_id,
      },
    });
  });

  
  it("should be able to create a new user", async () => {
    const email = `john.doe@example.com`;
    const password = "123456";

    const response = await request(app).post("/users").send({
      name: "John Doe",
      email,
      password: "123456",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user.name).toBe("John Doe");
    expect(response.body.user.email).toBe(email);
    expect(response.body.user).not.toHaveProperty("password");

    user_id = response.body.user.id;
  });

  it("should not be able to create a new user with same email", async () => {
    const response = await request(app).post("/users").send({
      name: "John duplicate Doe",
      email: "john.doe@example.com",
      password: "654321",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("User with same email already exists");
  });

  it("should throw a validation error if email is not valid", async () => {
    const response = await request(app).post("/users").send({
      name: "John Doe wrong email",
      email: "john.doe.com",
      password: "123456",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("validation error");
    expect(response.body.issues).toHaveProperty("email");
  });

  
});
