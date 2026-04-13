import request from "supertest";

import { app } from "@/app";
import { prisma } from "@/database/prisma";

describe("SessionsController", () => {
  let user_id: string;

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        id: user_id,
      },
    });
  });

  it("should authenticate and get an access token", async () => {

    const responseUser = await request(app).post("/users").send({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
    });
    

    user_id = responseUser.body.user.id;

    const response = await request(app).post("/sessions").send({
      email: "john.doe@example.com",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
    expect(response.body.token).toEqual(expect.any(String));
  });
});